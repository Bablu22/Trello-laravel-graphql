<?php

namespace App\GraphQL\Mutations;


use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Arr;
use GraphQL\Error\UserError;


final class Login
{
    /**
     * @param  null  $_
     * @param  array{}  $args
     */
    public function __invoke($_, array $args)
    {
        $guard = Auth::guard(Arr::first(config('sanctum.guard', 'web')));

        if (!$guard->attempt($args)) {
            throw new UserError('Invalid email or password.');
        }

        $user = $guard->user();

        return $user;
    }
}