<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

class Timeline extends Model
{
    protected $table = 'timeline';
    
    protected $fillable = [
        'user_id',
        'type',
        'title',
        'organization',
        'location',
        'start_date',
        'end_date',
        'is_current',
        'description',
        'metadata',
        'order',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'is_current' => 'boolean',
        'metadata' => 'array',
        'order' => 'integer',
    ];

    protected $appends = ['duration', 'date_range'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function scopeEducation($query)
    {
        return $query->where('type', 'education');
    }

    public function scopeExperience($query)
    {
        return $query->where('type', 'experience');
    }

    public function scopeCurrent($query)
    {
        return $query->where('is_current', true);
    }

    public function getDurationAttribute()
    {
        $start = Carbon::parse($this->start_date);
        $end = $this->is_current ? Carbon::now() : Carbon::parse($this->end_date);

        $years = $start->diffInYears($end);
        $months = $start->copy()->addYears($years)->diffInMonths($end);

        if ($years > 0 && $months > 0) {
            return "{$years} yr" . ($years > 1 ? 's' : '') . " {$months} mo";
        } elseif ($years > 0) {
            return "{$years} yr" . ($years > 1 ? 's' : '');
        } else {
            return "{$months} mo" . ($months > 1 ? 's' : '');
        }
    }

    public function getDateRangeAttribute()
    {
        $start = Carbon::parse($this->start_date)->format('M Y');
        $end = $this->is_current ? 'Present' : Carbon::parse($this->end_date)->format('M Y');
        return "{$start} - {$end}";
    }
}
