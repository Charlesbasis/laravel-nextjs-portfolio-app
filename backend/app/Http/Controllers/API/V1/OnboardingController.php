<?php

namespace App\Http\Controllers\API\V1;

use App\Http\Controllers\Controller;
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
    public function complete(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'username' => 'required|string|unique:user_profiles,username',
            'full_name' => 'required|string|max:255',
            'job_title' => 'required|string|max:255',
            'bio' => 'nullable|string',
            'location' => 'nullable|string',
            'tagline' => 'nullable|string|max:500',
            'project' => 'nullable|array',
            'project.title' => 'required_with:project|string',
            'project.description' => 'required_with:project|string',
            'project.technologies' => 'nullable|array',
            'skills' => 'nullable|array',
            'skills.*' => 'string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $user = $request->user();

        try {
            DB::transaction(function () use ($user, $request) {
                // Create profile
                UserProfile::create([
                    'user_id' => $user->id,
                    'username' => $request->username,
                    'full_name' => $request->full_name,
                    'email' => $user->email,
                    'job_title' => $request->job_title,
                    'bio' => $request->bio,
                    'location' => $request->location,
                    'tagline' => $request->tagline,
                    'is_public' => true,
                ]);

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
}
