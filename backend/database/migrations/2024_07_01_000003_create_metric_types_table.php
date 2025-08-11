<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMetricTypesTable extends Migration
{
    public function up()
    {
        Schema::create('metric_types', function (Blueprint $table) {
            $table->increments('id');  // int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY
            $table->string('name', 100)->nullable();
            $table->string('unit', 20)->nullable();
        });
    }

    public function down()
    {
        Schema::dropIfExists('metric_types');
    }
}
