<?php

namespace App\Repositories\Providers;

use App\Repositories\Eloquent\LikeRepository;
use App\Repositories\Interfaces\LikeRepositoryInterface;
use Illuminate\Support\ServiceProvider;
use App\Repositories\Eloquent\TagRepository;
use App\Repositories\Eloquent\CrudRepository;
use App\Repositories\Eloquent\ArticleRepository;
use App\Repositories\Eloquent\CategoryRepository;
use App\Repositories\Eloquent\QuestionRepository;
use App\Repositories\Eloquent\CommentRepository;
use App\Repositories\Interfaces\TagRepositoryInterface;
use App\Repositories\Interfaces\CrudRepositoryInterface;
use App\Repositories\Interfaces\ArticleRepositoryInterface;
use App\Repositories\Interfaces\CategoryRepositoryInterface;
use App\Repositories\Interfaces\QuestionRepositoryInterface;
use App\Repositories\Interfaces\CommentRepositoryInterface;


class RepositoryServiceProvider extends ServiceProvider
{
    public function register()
    {
        $this->app->bind(CrudRepositoryInterface::class, CrudRepository::class);
        $this->app->bind(TagRepositoryInterface::class, TagRepository::class);
        $this->app->bind(CategoryRepositoryInterface::class, CategoryRepository::class);
        $this->app->bind(ArticleRepositoryInterface::class, ArticleRepository::class);
        $this->app->bind(QuestionRepositoryInterface::class, QuestionRepository::class);
        $this->app->bind(CommentRepositoryInterface::class, CommentRepository::class);
        $this->app->bind(LikeRepositoryInterface::class, LikeRepository::class);
    }

    public function boot()
    {

    }
}
