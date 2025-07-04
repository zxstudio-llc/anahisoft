<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('company_name');
            $table->string('company_logo')->nullable();
            $table->string('company_address')->nullable();
            $table->string('company_phone')->nullable();
            $table->string('company_email')->nullable();
            $table->string('company_tax_id')->nullable();
            $table->string('currency', 3)->default('USD');
            $table->string('timezone')->default('UTC');
            // Additional SUNAT fields
            $table->string('ruc');
            $table->string('business_name'); // razon_social
            $table->string('trade_name')->nullable(); // nombre_comercial
            $table->string('status')->nullable(); // estado
            $table->string('condition')->nullable(); // condicion
            $table->string('address')->nullable(); // direccion
            $table->string('department')->nullable(); // departamento
            $table->string('province')->nullable(); // provincia
            $table->string('district')->nullable(); // distrito
            $table->date('registration_date')->nullable(); // fecha_inscripcion
            $table->string('emission_system')->nullable(); // sist_emision
            $table->string('accounting_system')->nullable(); // sist_contabilidad
            $table->string('foreign_trade_activity')->nullable(); // act_exterior
            $table->json('economic_activities')->nullable(); // act_economicas
            $table->json('payment_vouchers')->nullable(); // cp_pago
            $table->json('electronic_systems')->nullable(); // sist_electronica
            $table->date('electronic_emission_date')->nullable(); // fecha_emisor_fe
            $table->json('electronic_vouchers')->nullable(); // cpe_electronico
            $table->date('ple_date')->nullable(); // fecha_ple
            $table->json('registries')->nullable(); // padrones
            $table->date('withdrawal_date')->nullable(); // fecha_baja
            $table->string('profession')->nullable();
            $table->string('ubigeo')->nullable();
            $table->decimal('capital', 12, 2)->nullable();
            $table->json('additional_settings')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};
