<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('password');
            $table->foreignId('role_id')->nullable()->constrained()->onDelete('set null');
            $table->string('promotion_year')->nullable();
            $table->foreignId('profile_image_id')->nullable()->constrained('images')->onDelete('set null');
            $table->integer('score')->default(0);
            $table->rememberToken();
            $table->timestamps();
        });
    }


    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
