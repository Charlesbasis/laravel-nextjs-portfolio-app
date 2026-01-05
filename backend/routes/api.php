<?php

use App\Http\Controllers\API\V1\AuthController;
use App\Http\Controllers\API\V1\DashboardController;
use App\Http\Controllers\API\V1\OnboardingController;
use App\Http\Controllers\API\V1\PortfolioController;
use App\Http\Controllers\API\V1\ProfileController;
use App\Http\Controllers\API\V1\ProjectsController;
use App\Http\Controllers\API\V1\SkillsController;
use App\Http\Controllers\API\V1\ContactController;
use App\Http\Middleware\EnsureOnboardingCompleted;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    
    // ========================================
    // PUBLIC ROUTES - Single Portfolio Endpoint
    // ========================================
    Route::get('/portfolio/{username}', [PortfolioController::class, 'show']);
    Route::post('/contact', [ContactController::class, 'submit']);
    
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
