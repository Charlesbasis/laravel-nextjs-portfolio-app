<?php

namespace App\Http\Controllers\API\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class DashboardController extends Controller
{
    /**
     * Single dashboard endpoint - returns all essential data
     */
    public function summary(Request $request)
    {
        $user = $request->user()->load([
            'profile',
            'projects' => fn($q) => $q->latest()->limit(5),
            'skills',
            'timeline' => fn($q) => $q->latest('start_date')->limit(5),
        ]);

        $stats = [
            'projects' => [
                'total' => $user->projects()->count(),
                'published' => $user->projects()->where('status', 'published')->count(),
                'featured' => $user->projects()->where('featured', true)->count(),
            ],
            'skills' => [
                'total' => $user->skills()->count(),
                'by_proficiency' => $user->skills()
                    ->selectRaw('proficiency, COUNT(*) as count')
                    ->groupBy('proficiency')
                    ->pluck('count', 'proficiency'),
            ],
            'timeline' => [
                'education' => $user->timeline()->where('type', 'education')->count(),
                'experience' => $user->timeline()->where('type', 'experience')->count(),
            ],
            'profile_completion' => $this->calculateCompletion($user),
        ];

        return response()->json([
            'success' => true,
            'data' => [
                'user' => $user->only(['name', 'email', 'email_verified_at']),
                'profile' => $user->profile,
                'recent_projects' => $user->projects,
                'stats' => $stats,
            ],
        ]);
    }

    private function calculateCompletion($user)
    {
        $fields = [
            'profile_exists' => $user->profile !== null,
            'has_bio' => $user->profile?->bio !== null,
            'has_avatar' => $user->profile?->avatar_url !== null,
            'has_projects' => $user->projects()->exists(),
            'has_skills' => $user->skills()->exists(),
            'has_timeline' => $user->timeline()->exists(),
        ];

        $completed = count(array_filter($fields));
        return round(($completed / count($fields)) * 100);
    }
}
