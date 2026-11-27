<?php return [
    'wolf-events.controller.registration' => [
        'class' => \Wolf\Events\Controller\RegistrationController::class
    ],
    'wolf-events.controller.my_registrations' => [
        'class' => \Wolf\Events\Controller\MyRegistrationsController::class
    ],
    'wolf-events.use_case.get_my_registrations' => [
        'class' => \Wolf\Events\UseCase\GetMyRegistrationsUseCase::class,
        'tags' => [
            ['name' => 'use_case', 'value' => 'wolf-events.get_my_registrations']
        ],
        'shared' => false
    ],
    'wolf-events.use_case.get_event' => [
        'class' => \Wolf\Events\UseCase\GetEventUseCase::class,
        'arguments' => ['@wolf-api.client'],
        'tags' => [
            ['name' => 'use_case', 'value' => 'wolf-events.get_event']
        ],
        'shared' => false
    ],
    
    'wolf-events.use_case.register_to_event' => [
        'class' => \Wolf\Events\UseCase\RegisterToEventUseCase::class,
        'arguments' => ['@wolf-api.client'],
        'tags' => [
            ['name' => 'use_case', 'value' => 'wolf-events.register_to_event']
        ],
        'shared' => false
    ],
    'wolf-events.use_case.upload_file' => [
        'class' => \Wolf\Events\UseCase\UploadFileUseCase::class,
        'arguments' => ['@wolf-api.client'],
        'tags' => [
            ['name' => 'use_case', 'value' => 'wolf-events.upload_file']
        ],
        'shared' => false
    ],
    'wolf-events.use_case.remove_file' => [
        'class' => \Wolf\Events\UseCase\RemoveFileUseCase::class,
        'arguments' => ['@wolf-api.client'],
        'tags' => [
            ['name' => 'use_case', 'value' => 'wolf-events.remove_file']
        ],
        'shared' => false
    ],
    'wolf-events.use_case.download_file' => [
        'class' => \Wolf\Events\UseCase\DownloadFileUseCase::class,
        'arguments' => ['@wolf-api.client'],
        'tags' => [
            ['name' => 'use_case', 'value' => 'wolf-events.download_file']
        ],
        'shared' => false
    ],
    'wolf-events.use_case.check_member_exists' => [
        'class' => \Wolf\Events\UseCase\CheckMemberExistsUseCase::class,
        'arguments' => ['@wolf-api.client'],
        'tags' => [
            ['name' => 'use_case', 'value' => 'wolf-events.check_member_exists']
        ],
        'shared' => false
    ],
];