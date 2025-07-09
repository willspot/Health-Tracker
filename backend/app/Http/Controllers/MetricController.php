<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class MetricController extends Controller
{
    public function metrics(Request $request)
    {
        $user_id = Auth::id();
        if (!$user_id) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $fetchMetricHistory = function ($metric) use ($user_id) {
            return array_reverse(
                DB::table('health_metrics')
                    ->where('user_id', $user_id)
                    ->where('name', $metric)
                    ->orderByDesc('recorded_at')
                    ->limit(6)
                    ->pluck('value')
                    ->toArray()
            );
        };

        $metrics = [
            'heart_rate'   => $fetchMetricHistory('heart_rate'),
            'temperature'  => $fetchMetricHistory('temperature'),
            'steps'        => $fetchMetricHistory('steps'),
            'weight'       => $fetchMetricHistory('weight'),
            'food'         => $fetchMetricHistory('food'),
            'lungs'        => $fetchMetricHistory('lungs'),
            'blood_pressure' => [
                'systolic'  => $fetchMetricHistory('blood_pressure_systolic'),
                'diastolic' => $fetchMetricHistory('blood_pressure_diastolic'),
            ],
        ];

        return response()->json($metrics);
    }

    public function update(Request $request)
    {
        $user_id = auth()->id();
        if (!$user_id) {
            return response()->json(['status' => 'unauthorized'], 401);
        }

        // Validate required fields
        $type = trim($request->input('type', ''));
        $value = trim($request->input('value', ''));

        if (!$user_id) {
            return response()->json(['status' => 'unauthorized'], 401);
        }
        if (!$type || !$value) {
            return response()->json(['status' => 'missing_parameters'], 400);
        }
        if (!is_numeric($value)) {
            return response()->json(['status' => 'invalid_value'], 400);
        }

        try {
            // Get metric_type_id, name, unit
            $metric_type = DB::table('metric_types')->where('name', $type)->first();
            if (!$metric_type) {
                return response()->json(['status' => 'invalid_type']);
            }

            // Insert or update goal if posted
            if ($request->has('metric_goal') && in_array($type, ['food', 'steps'])) {
                $goalType = $type === 'food' ? 'calories' : 'steps';
                $goalValue = intval($request->input('metric_goal'));
                DB::table('goals')->updateOrInsert(
                    ['user_id' => $user_id, 'goal_type' => $goalType],
                    ['value' => $goalValue]
                );
            }

            // Insert new metric record
            DB::table('health_metrics')->insert([
                'user_id'     => $user_id,
                'metric_type' => $metric_type->id,
                'name'        => $metric_type->name,
                'unit'        => $metric_type->unit,
                'value'       => $value,
                'recorded_at' => now(),
            ]);

            return response()->json(['status' => 'success']);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }
}