<?php

namespace Wolf\Events\UseCase;

use GuzzleHttp\Client;
use Wolf\Core\UseCase\UseCaseBus;
use Wolf\Core\UseCase\UseCaseInterface;
use Wolf\Core\Entity\EntityManager;
use Wolf\Events\Entity\Repository\EventRepository;
use Wolf\Events\Entity\Repository\TicketRepository;
use Wolf\Events\Auth\CurrentUser;

class RegisterToEventUseCase implements UseCaseInterface
{
    private Client $client;



    public function __construct(Client $client)
    {
        $this->client = $client;
    }

    public function execute(array $params = [])
    {
        $payload = ['contact' => $params['contact'], 'participants' => $params['participants']];
        // Signed in with the club account: link the registration to it
        // ("My registrations" block).
        $subject = CurrentUser::subject();
        if ($subject !== null) {
            $payload['user_id'] = $subject;
        }

        $res = $this->client->post('/event/registration/' . $params['event_id'] . '/register', [
            'json' => $payload
        ]);

        $data = json_decode($res->getBody()->getContents(), true);
        return $data;
    }
}