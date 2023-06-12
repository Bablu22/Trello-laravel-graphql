<?php

namespace Database\Factories;

use App\Models\Board;
use App\Models\CardList;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\=CardList>
 */
class CardListFactory extends Factory
{
    protected $model = CardList::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => $this->faker->sentence,
            'board_id' => Board::factory(),
        ];
    }
}