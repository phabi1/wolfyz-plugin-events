<?php

namespace Wolf\Events\UseCase;

use GuzzleHttp\Client;
use Wolf\Core\UseCase\UseCaseInterface;

class GetEventUseCase implements UseCaseInterface
{
    private Client $client;

    public function __construct(Client $client)
    {
        $this->client = $client;
    }

    public function execute(array $params = [])
    {
        $id = $params['id'] ?? null;

        if (!$id) {
            throw new \InvalidArgumentException('ID is required');
        }

        try {
            $response = $this->client->get("/event/registration/{$id}/infos");
            $event = json_decode($response->getBody()->getContents(), true);
            return $event;
        } catch (\Exception $e) {
            throw new \RuntimeException('Failed to get event', 0, $e);
        }
    }
}