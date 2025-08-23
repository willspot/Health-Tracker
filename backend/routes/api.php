<?php

use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MetricController;
use App\Models\User;
use App\Http\Controllers\GoalController;
use App\Http\Controllers\UserController;

// JWT Auth Routes
Route::post('/login', function(Request $request) {
    $credentials = $request->only('email', 'password');
    
    if (!$token = auth('api')->attempt($credentials)) {
        return response()->json(['error' => 'Unauthorized'], 401);
    }

    return response()->json([
        'access_token' => $token,
        'token_type' => 'bearer',
        'expires_in' => auth('api')->factory()->getTTL() * 60
    ]);
});

Route::post('/signup', function(Request $request) {
    $validator = Validator::make($request->all(), [
        'name' => 'required|string|max:255',
        'email' => 'required|email|unique:users,email',
        'password' => 'required|string|min:6',
    ]);
    
    if ($validator->fails()) {
        return response()->json(['status' => 'error', 'message' => $validator->errors()->first()]);
    }
    
    $user = User::create([
        'name' => $request->name,
        'email' => $request->email,
        'password' => Hash::make($request->password),
    ]);

    $token = auth('api')->attempt(['email' => $user->email, 'password' => $request->password]);
    
    return response()->json([
        'status' => 'success',
        'access_token' => $token,
        'token_type' => 'bearer',
        'expires_in' => auth('api')->factory()->getTTL() * 60,
        'user' => [
            'name' => $user->name,
            'email' => $user->email
        ]
    ]);
});


Route::post('/check-email', function (Request $request) {
    $request->validate([
        'email' => 'required|email',
    ]);

    $exists = User::where('email', $request->email)->exists();

    return response()->json(['exists' => $exists]);
});



Route::post('/reset-password', [UserController::class, 'resetPassword']);



// Protected routes
Route::middleware('auth:api')->group(function () {
    Route::get('/user', function (Request $request) {
        return auth('api')->user();
    });

    Route::post('/logout', function() {
        auth('api')->logout();
        return response()->json(['message' => 'Successfully logged out']);
    });

    // Metrics
    Route::get('/metrics', [MetricController::class, 'metrics']);
    Route::post('/update_metric', [MetricController::class, 'update']);

    // Goals
    Route::get('/goals', [GoalController::class, 'getGoals']);

    // User profile update
    Route::post('/user/update', [UserController::class, 'updateProfile']);

    // Change password
    Route::post('/user/password', [UserController::class, 'changePassword']);
});
