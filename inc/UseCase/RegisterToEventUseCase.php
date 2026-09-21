<?php

namespace Wolf\Events\UseCase;

use GuzzleHttp\Client;
use Wolf\Core\UseCase\UseCaseBus;
use Wolf\Core\UseCase\UseCaseInterface;
use Wolf\Core\Entity\EntityManager;
use Wolf\Events\Entity\Repository\EventRepository;
use Wolf\Events\Entity\Repository\TicketRepository;

class RegisterToEventUseCase implements UseCaseInterface
{
    private Client $client;



    public function __construct(Client $client)
    {
        $this->client = $client;
    }

    public function execute(array $params = [])
    {
        $res = $this->client->post('/event/registration/' . $params['event_id'] . '/register', [
            'json' => ['contact' => $params['contact'], 'participants' => $params['participants']]
        ]);

        $data = json_decode($res->getBody()->getContents(), true);
        return $data;
    }
}