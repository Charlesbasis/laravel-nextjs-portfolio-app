<?php

namespace App\Http\Controllers\API\V1;

use App\Http\Controllers\Controller;
use App\Models\Timeline;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TimelineController extends Controller
{
    /**
     * Display user's timeline entries
     */
    public function index(Request $request)
    {
        $query = Timeline::where('user_id', $request->user()->id)
            ->orderBy('start_date', 'desc');

        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        $timeline = $query->get();

        return response()->json([
            'success' => true,
            'data' => $timeline,
        ]);
    }

    /**
     * Store new timeline entry
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'type' => 'required|in:education,experience',
            'title' => 'required|string|max:255',
            'organization' => 'required|string|max:255',
            'location' => 'nullable|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after:start_date',
            'is_current' => 'boolean',
            'description' => 'nullable|string',
            'metadata' => 'nullable|array',
            'order' => 'nullable|integer',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $data = $validator->validated();
        $data['user_id'] = $request->user()->id;

        if ($data['is_current'] ?? false) {
            $data['end_date'] = null;
        }

        $timeline = Timeline::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Timeline entry created successfully',
            'data' => $timeline,
        ], 201);
    }

    /**
     * Update timeline entry
     */
    public function update(Request $request, Timeline $timeline)
    {
        $this->authorize('update', $timeline);

        $validator = Validator::make($request->all(), [
            'type' => 'in:education,experience',
            'title' => 'string|max:255',
            'organization' => 'string|max:255',
            'location' => 'nullable|string|max:255',
            'start_date' => 'date',
            'end_date' => 'nullable|date|after:start_date',
            'is_current' => 'boolean',
            'description' => 'nullable|string',
            'metadata' => 'nullable|array',
            'order' => 'nullable|integer',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $data = $validator->validated();

        if ($data['is_current'] ?? false) {
            $data['end_date'] = null;
        }

        $timeline->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Timeline entry updated successfully',
            'data' => $timeline,
        ]);
    }

    /**
     * Delete timeline entry
     */
    public function destroy(Timeline $timeline)
    {
        $this->authorize('delete', $timeline);

        $timeline->delete();

        return response()->json([
            'success' => true,
            'message' => 'Timeline entry deleted successfully',
        ]);
    }
}
