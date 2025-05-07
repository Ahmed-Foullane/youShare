<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Validation\Rule;

class UpdateProfileRequest extends FormRequest
{

    public function authorize()
    {
        return true;
    }

  
    public function rules(){
        $userId = auth()->id();
        
        return [
            'first_name' => 'sometimes|required|string|max:255',
            'last_name' => 'sometimes|required|string|max:255',
            'email' => [
                'sometimes',
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('users')->ignore($userId),
            ],
            'promotion_year' => 'sometimes|nullable|numeric|min:2000|max:'.date('Y'),
            'password' => 'sometimes|nullable|string|min:8|confirmed',
        ];
    }

  
   

    public function messages() {
        return [
            'first_name.required' => 'The first name field is required',
            'last_name.required' => 'The last name field is required',
            'email.required' => 'The email field is required',
            'email.email' => 'Please enter a valid email address',
            'email.unique' => 'This email is already in use',
            'password.min' => 'Password must be at least 8 characters',
            'password.confirmed' => 'Password confirmation does not match',
            'promotion_year.numeric' => 'Promotion year must be a number',
            'promotion_year.min' => 'Promotion year cannot be earlier than 2000',
            'promotion_year.max' => 'Promotion year cannot be later than current year',
        ];
    }
}