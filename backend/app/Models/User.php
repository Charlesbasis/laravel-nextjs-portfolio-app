<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'onboarding_completed',
        'onboarding_completed_at',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'onboarding_completed_at' => 'datetime',
        'password' => 'hashed',
    ];

    public function profile()
    {
        return $this->hasOne(UserProfile::class);
    }

    public function projects()
    {
        return $this->hasMany(Projects::class);
    }

    public function skills()
    {
        return $this->hasMany(Skill::class);
    }

    public function timeline()
    {
        return $this->hasMany(Timeline::class);
    }

    public function certifications()
    {
        return $this->hasMany(Certification::class);
    }

    public function testimonials()
    {
        return $this->hasMany(Testimonial::class);
    }

    public function services()
    {
        return $this->hasMany(Service::class);
    }

    public function completedOnboarding()
    {
        $this->update([
            'onboarding_completed' => true,
            'onboarding_completed_at' => now(),
        ]);
        return $this->fresh();
    }

    public function hasCompletedOnboarding()
    {
        return $this->onboarding_completed;
    }
}
