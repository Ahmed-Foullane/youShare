<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TagRequest extends FormRequest
{
    public function authorize(){
        return true; 
    }

    public function rules(){
        $rules = [
            'name' => 'required|string|max:30|unique:tags,name',
        ];

        if ($this->isMethod('PUT') || $this->isMethod('PATCH')) {
            $rules['name'] = 'required|string|max:30|unique:tags,name,' . $this->route('id');
        }

        return $rules;
    }
}