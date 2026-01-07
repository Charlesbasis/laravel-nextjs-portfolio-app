<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Projects;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;

class PublicController extends Controller
{
    /**
     * Get all public portfolios for sitemap generation
     */
    public function portfolios(): JsonResponse
    {
        // Cache for 1 hour
        $users = Cache::remember('public_portfolios', 3600, function () {
            return User::where('is_public', true)
                ->whereNotNull('username')
                ->select('username', 'full_name', 'updated_at', 'created_at')
                ->orderBy('updated_at', 'desc')
                ->get();
        });

        return response()->json([
            'success' => true,
            'data' => $users,
        ]);
    }

    /**
     * Get all published projects for sitemap generation
     */
    public function projects(): JsonResponse
    {
        // Cache for 1 hour
        $projects = Cache::remember('public_projects', 3600, function () {
            return Projects::where('status', 'published')
                ->select('slug', 'title', 'updated_at', 'created_at')
                ->orderBy('updated_at', 'desc')
                ->get();
        });

        return response()->json([
            'success' => true,
            'data' => $projects,
        ]);
    }

    /**
     * Get sitemap data (combined portfolios and projects)
     * Optimized for sitemap generation with caching
     */
    public function sitemapData(): JsonResponse
    {
        // Cache combined data for 1 hour
        $data = Cache::remember('sitemap_data', 3600, function () {
            $users = User::where('is_public', true)
                ->whereNotNull('username')
                ->select('username', 'full_name', 'updated_at', 'created_at')
                ->orderBy('updated_at', 'desc')
                ->get();

            $projects = Projects::where('status', 'published')
                ->select('slug', 'title', 'updated_at', 'created_at')
                ->orderBy('updated_at', 'desc')
                ->get();

            return [
                'portfolios' => $users,
                'projects' => $projects,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $data,
        ])->header('Cache-Control', 'public, max-age=3600');
    }

    /**
     * Get featured portfolios (for homepage)
     */
    public function featuredPortfolios(): JsonResponse
    {
        $users = Cache::remember('featured_portfolios', 1800, function () {
            return User::where('is_public', true)
                ->whereNotNull('username')
                ->where('is_featured', true) // Add this column to users table if needed
                ->select('username', 'full_name', 'tagline', 'avatar_url')
                ->limit(6)
                ->get();
        });

        return response()->json([
            'success' => true,
            'data' => $users,
        ]);
    }

    /**
     * Get popular portfolios (by views)
     */
    public function popularPortfolios(): JsonResponse
    {
        $users = Cache::remember('popular_portfolios', 1800, function () {
            return User::join('user_profiles', 'users.id', '=', 'user_profiles.user_id')
                ->where('user_profiles.is_public', true)
                ->whereNotNull('user_profiles.username')
                ->select(
                    'user_profiles.username',
                    'user_profiles.full_name',
                    'user_profiles.tagline',
                    'user_profiles.avatar_url',
                    'user_profiles.profile_views'
                )
                ->orderBy('user_profiles.profile_views', 'desc')
                ->limit(6)
                ->get();
        });

        return response()->json([
            'success' => true,
            'data' => $users,
        ]);
    }

    /**
     * Clear all public caches (for admin use)
     */
    public function clearCache(): JsonResponse
    {
        Cache::forget('public_portfolios');
        Cache::forget('public_projects');
        Cache::forget('sitemap_data');
        Cache::forget('featured_portfolios');
        Cache::forget('popular_portfolios');

        return response()->json([
            'success' => true,
            'message' => 'Public caches cleared successfully',
        ]);
    }
}
