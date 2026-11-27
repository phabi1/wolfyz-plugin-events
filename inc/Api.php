<?php

namespace Wolf\Events;

use Wolf\Core\Di\ContainerAwareInterface;
use Wolf\Core\Di\ContainerAwareTrait;
use Wolf\Core\Plugin;

class Api implements ContainerAwareInterface
{
    use ContainerAwareTrait;

    public function setup()
    {
        add_action('rest_api_init', function () {
            $this->registerRegistrationRoutes();
            $this->registerMyRegistrationsRoutes();
        });
    }

    protected function getContainer()
    {
        if ($this->container === null) {
            $this->setContainer(Plugin::getContainer());
        }
        return $this->container;
    }

    public function getController($controllerName)
    {
        return $this->getContainer()->get($controllerName);
    }

    /**
     * Registrations of the signed-in user ("My registrations" block). Cookie
     * authentication: WordPress requires the X-WP-Nonce header to set the user.
     */
    protected function registerMyRegistrationsRoutes()
    {
        $controller = $this->getController('wolf-events.controller.my_registrations');
        register_rest_route('wolf-events/v1', '/me/registrations', [
            'methods' => 'GET',
            'callback' => [$controller, 'list'],
            'permission_callback' => function () {
                return is_user_logged_in()
                    ?: new \WP_Error('not_connected', 'Connexion requise.', ['status' => 401]);
            },
        ]);
    }

    protected function registerRegistrationRoutes()
    {
        $controller = $this->getController('wolf-events.controller.registration');
        register_rest_route('wolf-events/v1', '/events/(?P<event_id>\d+)/registration', [
            'methods' => 'GET',
            'callback' => [$controller, 'info'],
            'permission_callback' => '__return_true',
        ]);
        register_rest_route(
            'wolf-events/v1',
            '/events/(?P<event_id>\d+)/register',
            [
                'methods' => 'POST',
                'callback' => [$controller, 'register'],
                'permission_callback' => function ($request) {
                    $nonce = $request->get_header('X-WP-Nonce');

                    if (! $nonce || ! wp_verify_nonce($nonce, 'wp_rest')) {
                        return new \WP_Error('invalid_nonce', 'Nonce invalide', ['status' => 403]);
                    }

                    return true;
                },
            ]
        );

        register_rest_route(
            'wolf-events/v1',
            '/events/(?P<event_id>\d+)/upload-file',
            [
                'methods' => 'POST',
                'callback' => [$controller, 'uploadFile'],
                'permission_callback' => '__return_true',
            ]
        );

        register_rest_route(
            'wolf-events/v1',
            '/events/(?P<event_id>\d+)/remove-file',
            [
                'methods' => 'POST',
                'callback' => [$controller, 'removeFile'],
                'permission_callback' => '__return_true',
            ]
        );

        register_rest_route(
            'wolf-events/v1',
            '/events/(?P<event_id>\d+)/download-file',
            [
                'methods' => 'POST',
                'callback' => [$controller, 'downloadFile'],
                'permission_callback' => '__return_true',
            ]
        );

        register_rest_route(
            'wolf-events/v1',
            '/events/(?P<event_id>\d+)/check-member',
            [
                'methods' => 'GET',
                'callback' => [$controller, 'checkMember'],
                'permission_callback' => '__return_true',
            ]
        );
    }
}