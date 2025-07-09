<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class GoalController extends Controller
{
    public function getGoals(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $goals = DB::table('goals')
            ->where('user_id', $user->id)
            ->whereIn('goal_type', ['calories', 'steps'])
            ->pluck('value', 'goal_type');

        return response()->json($goals);
    }
}
