<?php

use App\Http\Controllers\API\PublicController;
use App\Http\Controllers\API\V1\AuthController;
use App\Http\Controllers\API\V1\CertificationController;
use App\Http\Controllers\API\V1\DashboardController;
use App\Http\Controllers\API\V1\OnboardingController;
use App\Http\Controllers\API\V1\PortfolioController;
use App\Http\Controllers\API\V1\ProfileController;
use App\Http\Controllers\API\V1\ProjectsController;
use App\Http\Controllers\API\V1\SkillsController;
use App\Http\Controllers\API\V1\ContactController;
use App\Http\Controllers\API\V1\TimelineController;
use App\Http\Middleware\EnsureOnboardingCompleted;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {

/*
|--------------------------------------------------------------------------
| Public API Routes (No Authentication Required)
|--------------------------------------------------------------------------
*/

    // Sitemap endpoints
    Route::prefix('public')->group(function () {
        Route::get('/portfolios', [PublicController::class, 'portfolios']);
        Route::get('/projects', [PublicController::class, 'projects']);
        Route::get('/sitemap-data', [PublicController::class, 'sitemapData']);
    });

    // Public user profiles
    Route::get('/users/{username}/profile', [ProfileController::class, 'showPublic']);
    Route::get('/users/{username}/stats', [ProfileController::class, 'stats']);
    Route::get('/users/{username}/experiences', [ProfileController::class, 'experiences']);
    Route::get('/users/{username}/education', [ProfileController::class, 'education']);
    Route::get('/users/{username}/certifications', [ProfileController::class, 'certifications']);

    // Public projects
    Route::get('/projects', [ProjectsController::class, 'index']);
    Route::get('/projects/{slug}', [ProjectsController::class, 'show']);

    // Public skills (with optional user_id filter)
    Route::get('/skills', [SkillsController::class, 'index']);


    // ========================================
    // AUTH ROUTES
    // ========================================
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::get('/email/verify/{id}/{hash}', [AuthController::class, 'verifyEmail'])
        ->middleware(['signed'])
        ->name('verification.verify');
    
    // ========================================
    // AUTHENTICATED ROUTES (NO ONBOARDING CHECK)
    // ========================================
    Route::middleware(['auth:sanctum'])->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/user', [AuthController::class, 'user']);
        Route::post('/email/resend', [AuthController::class, 'resendVerificationEmail']);
        
        // Onboarding - Single endpoint
        Route::prefix('onboarding')->group(function () {
            Route::get('/status', [OnboardingController::class, 'status']);
            Route::post('/complete', [OnboardingController::class, 'complete']);
            Route::get('/check-username', [OnboardingController::class, 'checkUsername']);
        });
    });

    // ========================================
    // AUTHENTICATED + ONBOARDING COMPLETED
    // ========================================
    Route::middleware(['auth:sanctum', EnsureOnboardingCompleted::class])->group(function () {
        
        // Profile Management
        Route::prefix('profile')->group(function () {
            Route::get('/', [ProfileController::class, 'show']);
            Route::put('/', [ProfileController::class, 'update']);
            Route::post('/avatar', [ProfileController::class, 'uploadAvatar']);
            Route::post('/cover-image', [ProfileController::class, 'uploadCoverImage']);
        });
        
        // Dashboard - Simplified
        Route::get('/dashboard', [DashboardController::class, 'summary']);
        
        // Resource Management (for admin/user editing)
        Route::apiResource('projects', ProjectsController::class)->except(['index', 'show']);
        Route::apiResource('skills', SkillsController::class);
        Route::apiResource('timeline', TimelineController::class);
        Route::apiResource('certifications', CertificationController::class);
        
        // Clear cache after updates
        Route::post('/portfolio/{username}/clear-cache', [PortfolioController::class, 'clearCache']);
    });
});
