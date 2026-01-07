<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserTypeField extends Model
{
    protected $fillable = ['label', 'name', 'type', 'user_type_id'];
}
