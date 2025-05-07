<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\Auth\UpdateProfileImageRequest;
use App\Http\Requests\Auth\UpdateProfileRequest;
use App\Models\Image;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(RegisterRequest $request)
    {
        $validatedData = $request->validated();
        $profileImageId = null;

        $user = User::create([
            'first_name' => $validatedData['first_name'],
            'last_name' => $validatedData['last_name'],
            'email' => $validatedData['email'],
            'password' => Hash::make($validatedData['password']),
            'promotion_year' => $validatedData['promotion_year'],
            'profile_image_id' => $profileImageId,
            'score' => 0,
        ]);

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'success' => true,
            'user' => $user,
            // 'user' => $user->load('profileImage'),
            'access_token' => $token,
            'token_type' => 'Bearer',
        ], 201);
    }

    public function login(LoginRequest $request)
    {
        $validatedData = $request->validated();
        $user = User::where('email', $validatedData['email'])->first();

        if (!$user || !Hash::check($validatedData['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'success' => true,
            'user' => $user->load(['role', 'profileImage']),
            'access_token' => $token,
            'token_type' => 'Bearer',
        ]);
    }

    public function logout()
    {
        auth()->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully'
        ]);
    }

    public function user()
    {
        $user = auth()->user();
        
        if (!$user) {
            return response()->json(['error' => 'User not authenticated'], 401);
        }
        
        return response()->json($user->load(['role', 'profileImage']));
    }
    
    public function updateProfile(UpdateProfileRequest $request)
    {
        $validatedData = $request->validated();
        $user = auth()->user();
        
        $user->fill(array_filter($validatedData, function($value) {
            return $value !== null && $value !== '';
        }));
        
        if (isset($validatedData['password']) && !empty($validatedData['password'])) {
            $user->password = Hash::make($validatedData['password']);
        }
        
        $user->save();
        
        return response()->json([
            'success' => true,
            'message' => 'Profile updated successfully',
            'user' => $user->load(['role', 'profileImage']),
        ]);
    }
    
    public function updateProfileImage(UpdateProfileImageRequest $request)
    {
        $user = auth()->user();
                if ($user->profile_image_id) {
            $oldImage = Image::find($user->profile_image_id);
            if ($oldImage) {
                Storage::disk('public')->delete($oldImage->file_path);
                $oldImage->delete();
            }
        }
        
        $file = $request->file('profile_image');
        $fileName = time() . '_' . $file->getClientOriginalName();
        $filePath = $file->storeAs('profile_images', $fileName, 'public');
        
        $image = Image::create(['file_path' => $filePath]);
        
        $user->profile_image_id = $image->id;
        $user->save();
        
        return response()->json([
            'success' => true,
            'message' => 'Profile image updated successfully',
            'user' => $user->load(['role', 'profileImage']),
        ]);
    }
}