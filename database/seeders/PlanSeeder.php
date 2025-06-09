<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use App\Models\Plan;
class PlanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $plans = [
            [
                'name' => 'Básico',
                'slug' => Str::slug('Básico'),
                'description' => 'Ideal para pequeñas empresas que recién comienzan.',
                'price' => 19.99,
                'trial_days' => 14,
                'features' => json_encode(['1 usuario', '5 GB almacenamiento', 'Soporte por correo']),
                'is_active' => true,
            ],
            [
                'name' => 'Pro',
                'slug' => Str::slug('Pro'),
                'description' => 'Para empresas medianas que necesitan más recursos.',
                'price' => 49.99,
                'trial_days' => 30,
                'features' => json_encode(['5 usuarios', '50 GB almacenamiento', 'Soporte prioritario']),
                'is_active' => true,
            ],
            [
                'name' => 'Enterprise',
                'slug' => Str::slug('Enterprise'),
                'description' => 'Para grandes empresas con necesidades avanzadas.',
                'price' => 99.99,
                'trial_days' => 30,
                'features' => json_encode(['Usuarios ilimitados', '500 GB almacenamiento', 'Gerente de cuenta dedicado']),
                'is_active' => true,
            ],
        ];

        foreach ($plans as $plan) {
            Plan::updateOrCreate(
                ['slug' => $plan['slug']], // evita duplicados por slug
                $plan
            );
        }
    }
}
