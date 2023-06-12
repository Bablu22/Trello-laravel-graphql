<?php

namespace App\Listeners;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Arr;
use Illuminate\Auth\Events\Registered;

class AuthenticateUser
{

    /**
     * Handle the event.
     */
    public function handle(Registered $event): void
    {
        $guard = Auth::guard(Arr::first(config('sanctum.guard', 'web')));

        $guard->login($event->user);
    }
}