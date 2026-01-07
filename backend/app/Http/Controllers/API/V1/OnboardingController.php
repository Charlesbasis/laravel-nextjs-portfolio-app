<?php

namespace App\Http\Controllers\API\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\CompleteOnboardingRequest;
use App\Models\User;
use App\Models\UserProfile;
use App\Models\Projects;
use App\Models\Skill;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class OnboardingController extends Controller
{
    /**
     * Get onboarding status
     */
    public function status(Request $request)
    {
        $user = $request->user();
        
        return response()->json([
            'completed' => $user->onboarding_completed,
            'profile' => $user->profile,
        ]);
    }

    /**
     * Complete onboarding - Single step
     */
    public function complete(CompleteOnboardingRequest $request)
    {
        $user = $request->user();
        $validated = $request->validated(); // Get only validated data

        try {
            DB::transaction(function () use ($user, $validated, $request) {
                UserProfile::updateOrCreate(
                    ['user_id' => $user->id], // Search criteria
                    [
                        'username' => $validated['username'],
                        'full_name' => $validated['full_name'],
                        'email' => $user->email,
                        'job_title' => $validated['job_title'],
                        'bio' => $validated['bio'] ?? null,
                        'location' => $validated['location'] ?? null,
                        'tagline' => $validated['tagline'] ?? null,
                        'is_public' => true,
                    ]
                );

                // Create project if provided
                if ($request->has('project')) {
                    Projects::create([
                        'user_id' => $user->id,
                        'title' => $request->input('project.title'),
                        'slug' => Str::slug($request->input('project.title')) . '-' . uniqid(),
                        'description' => $request->input('project.description'),
                        'technologies' => $request->input('project.technologies', []),
                        'status' => 'published',
                        'type' => 'personal_project',
                    ]);
                }

                // Create skills if provided
                if ($request->has('skills')) {
                    foreach ($request->skills as $skillName) {
                        Skill::create([
                            'user_id' => $user->id,
                            'name' => $skillName,
                            'slug' => Str::slug($skillName) . '-' . uniqid(),
                            'category' => 'other',
                            'proficiency' => 'intermediate',
                        ]);
                    }
                }

                // Mark onboarding as complete
                $user->completedOnboarding();
            });

            return response()->json([
                'success' => true,
                'message' => 'Onboarding completed successfully',
                'user' => $user->fresh(['profile']),
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to complete onboarding: ' . $e->getMessage()
            ], 500);
        }
    }

    public function checkUsername(Request $request)
    {
        $username = strtolower($request->query('username'));

        // 1. Validate format immediately to save a DB query
        if (!preg_match('/^[a-z0-9_\-]+$/', $username)) {
            return response()->json([
                'available' => false,
                'message' => 'Invalid format'
            ]);
        }

        // 2. Check existence, excluding the current authenticated user
        $exists = \App\Models\UserProfile::where('username', $username)
            ->where('user_id', '!=', auth()->id())
            ->exists();

        return response()->json([
            'available' => !$exists,
        ]);
    }
}
