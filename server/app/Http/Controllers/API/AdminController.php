<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\User;
use App\Models\Question;
use App\Models\Comment;
use App\Models\Tag;
use App\Models\Category;
use App\Models\Role;
use Illuminate\Http\Request;

class AdminController extends Controller{
  
    public function getStats(){
        $stats = [
            'users_count' => User::count(),
            'articles_count' => Article::count(),
            'questions_count' => Question::count(),
            'comments_count' => Comment::count(),
            'categories_count' => Category::count(),
            'tags_count' => Tag::count(),
        ];
        
        return response()->json($stats);
    }
    

    public function getUsers(){
        $users = User::with('role')->get();
        return response()->json($users);
    }
    

    public function deleteUser($id) {
        $user = User::findOrFail($id);
        
        if ($user->id === auth()->id()) {
            return response()->json([
                'message' => 'You cannot delete your own account'
            ], 403);
        }
        
        $user->delete();
        
        return response()->json(['message' => 'User deleted successfully']);
    }
    
    public function updateUserRole(Request $request, $id) {
        $request->validate([
            'role_id' => 'required|exists:roles,id'
        ]);
        
        $user = User::findOrFail($id);
        
        if ($user->id === auth()->id()) {
            return response()->json([
                'message' => 'You cannot change your own role'
            ], 403);
        }
        
        $user->role_id = $request->role_id;
        $user->save();
        
        return response()->json([
            'message' => 'User role updated successfully',
            'user' => $user->load('role')
        ]);
    }
    
    public function getRoles() {
        $roles = Role::all();
        return response()->json($roles);
    }

    public function getArticles(){
        $articles = Article::with(['user', 'category'])->get();
        return response()->json($articles);
    }
    
    public function deleteArticle($id) {
        $article = Article::findOrFail($id);
        $article->delete();
        return response()->json(['message' => 'Article deleted successfully']);
    }

    public function getQuestions() {
        $questions = Question::with('user')->get();
        return response()->json($questions);
    }

    public function deleteQuestion($id){
        $question = Question::findOrFail($id);
        $question->delete();
        return response()->json(['message' => 'Question deleted successfully']);
    }

    public function getComments(){
        $comments = Comment::with(['user', 'question'])->get();
        return response()->json($comments);
    }
    
    public function deleteComment($id) {
        $comment = Comment::findOrFail($id);
        $comment->delete();
        return response()->json(['message' => 'Comment deleted successfully']);
    }
}