<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRolesTable extends Migration
{
    public function up()
    {
        Schema::create('roles', function (Blueprint $table) {
            $table->increments('id');  // int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY
            $table->string('name', 50);
        });
    }

    public function down()
    {
        Schema::dropIfExists('roles');
    }
}
