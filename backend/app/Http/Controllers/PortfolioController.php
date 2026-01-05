<?php

namespace App\Http\Controllers\API\V1;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Cache;

class PortfolioController extends Controller
{
    /**
     * Get complete portfolio data in one call
     */
    public function show($username)
    {
        $cacheKey = "portfolio:{$username}";
        
        $data = Cache::remember($cacheKey, 3600, function () use ($username) {
            $user = User::with([
                'profile',
                'projects' => fn($q) => $q->where('status', 'published')->orderBy('order'),
                'skills' => fn($q) => $q->orderBy('proficiency', 'desc'),
                'timeline' => fn($q) => $q->orderBy('start_date', 'desc'),
                'certifications' => fn($q) => $q->orderBy('issue_date', 'desc'),
                'testimonials' => fn($q) => $q->where('featured', true),
                'services'
            ])
            ->whereHas('profile', fn($q) => $q->where('username', $username))
            ->firstOrFail();

            $profile = $user->profile;

            if (!$profile || !$profile->is_public) {
                abort(404, 'Profile not found or is private');
            }

            // Build SEO meta
            $meta = [
                'title' => "{$profile->full_name} - {$profile->job_title}",
                'description' => $profile->tagline ?: $profile->bio,
                'ogImage' => $profile->avatar_url,
                'canonical' => url("/portfolio/{$username}"),
                'structuredData' => [
                    '@context' => 'https://schema.org',
                    '@type' => 'Person',
                    'name' => $profile->full_name,
                    'jobTitle' => $profile->job_title,
                    'url' => url("/portfolio/{$username}"),
                    'image' => $profile->avatar_url,
                    'description' => $profile->bio,
                ],
            ];

            // Group timeline by type
            $education = $user->timeline->where('type', 'education')->values();
            $experience = $user->timeline->where('type', 'experience')->values();

            // Stats
            $stats = [
                'projects' => $user->projects->count(),
                'skills' => $user->skills->count(),
                'experience_years' => $experience->sum(function ($exp) {
                    $start = \Carbon\Carbon::parse($exp->start_date);
                    $end = $exp->is_current ? now() : \Carbon\Carbon::parse($exp->end_date);
                    return $start->diffInYears($end);
                }),
                'profile_views' => $profile->profile_views,
            ];

            return [
                'profile' => $profile,
                'projects' => $user->projects,
                'skills' => $user->skills->groupBy('category'),
                'education' => $education,
                'experience' => $experience,
                'certifications' => $user->certifications,
                'testimonials' => $user->testimonials,
                'services' => $user->services,
                'stats' => $stats,
                'meta' => $meta,
            ];
        });

        // Increment views (don't cache this)
        $user = User::whereHas('profile', fn($q) => $q->where('username', $username))->first();
        $user?->profile?->incrementViews();

        return response()->json([
            'success' => true,
            'data' => $data,
        ]);
    }

    /**
     * Clear portfolio cache
     */
    public function clearCache($username)
    {
        Cache::forget("portfolio:{$username}");
        return response()->json(['success' => true]);
    }
}
