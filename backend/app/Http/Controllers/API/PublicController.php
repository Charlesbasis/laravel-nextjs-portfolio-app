<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Projects;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class PublicController extends Controller
{
    /**
     * Get all public portfolios for sitemap generation
     */
    public function portfolios(): JsonResponse
    {
        $users = User::where('is_public', true)
            ->whereNotNull('username')
            ->select('username', 'full_name', 'updated_at', 'created_at')
            ->orderBy('updated_at', 'desc')
            ->get();

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
        $projects = Projects::where('status', 'published')
            ->select('slug', 'title', 'updated_at', 'created_at')
            ->orderBy('updated_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $projects,
        ]);
    }

    /**
     * Get sitemap data (combined portfolios and projects)
     */
    public function sitemapData(): JsonResponse
    {
        $users = User::where('is_public', true)
            ->whereNotNull('username')
            ->select('username', 'full_name', 'updated_at', 'created_at')
            ->get();

        $projects = Projects::where('status', 'published')
            ->select('slug', 'title', 'updated_at', 'created_at')
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'portfolios' => $users,
                'projects' => $projects,
            ],
        ]);
    }
}
