<?php

namespace Wolf\Events\Controller;

use Wolf\Core\Mvc\Controller\AbstractController;

/**
 * "My registrations" block: registrations of the signed-in user.
 */
class MyRegistrationsController extends AbstractController
{
    public function listAction($request)
    {
        return $this->getService('wolf.use-case.bus')->execute('wolf-events.get_my_registrations', []);
    }
}
