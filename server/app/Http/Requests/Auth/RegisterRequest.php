<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class RegisterRequest extends FormRequest
{
   
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'promotion_year' => 'nullable|string',
            'profile_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ];
    }


    public function messages()
    {
        return [
            'first_name.required' => 'Your first name is required',
            'last_name.required' => 'Your last name is required',
            'email.required' => 'Your email address is required',
            'email.email' => 'Please provide a valid email address',
            'email.unique' => 'This email is already registered',
            'password.required' => 'A password is required',
            'password.min' => 'Your password must be at least 8 characters',
            'password.confirmed' => 'Password confirmation does not match',
            'profile_image.image' => 'The file must be an image',
            'profile_image.mimes' => 'The image must be a file of type: jpeg, png, jpg, gif',
            'profile_image.max' => 'The image size must not exceed 2MB',
        ];
    }
}