<?php

// Di-generate oleh php artisan template:zip - hanya berisi flavor "landing-apotek".
// Ganti brand/warna di bawah, atau set TEMPLATE_FLAVOR di .env.

return [
    'flavor' => env('TEMPLATE_FLAVOR', 'landing-apotek'),

    'flavors' => array (
  'landing-apotek' => 
  array (
    'label' => 'APOTEK FARMA 24 — Apotek',
    'brand_name' => 'APOTEK FARMA 24',
    'brand_tagline' => 'Obat asli, siap antar kapan saja',
    'brand_initials' => 'F24',
    'accent' => '#14b8a6',
    'category' => 'kesehatan',
    'home' => 'landings.apotek',
    'nav' => 
    array (
      'sections' => 
      array (
        0 => 
        array (
          'label' => 'Menu',
          'items' => 
          array (
            0 => 
            array (
              'label' => 'Landing',
              'to' => '/landings/apotek',
              'icon' => 'Home',
            ),
            1 => 
            array (
              'label' => 'Dashboard',
              'to' => '/dashboard',
              'icon' => 'LayoutDashboard',
            ),
            2 => 
            array (
              'label' => 'Pengaturan',
              'to' => '/settings',
              'icon' => 'Settings',
            ),
          ),
        ),
      ),
    ),
  ),
),
];
