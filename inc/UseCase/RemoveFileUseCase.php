<?php

namespace Wolf\Events\UseCase;

use GuzzleHttp\Client;
use Wolf\Core\UseCase\UseCaseInterface;

class RemoveFileUseCase implements UseCaseInterface
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
            $response = $this->client->post("/event/registration/{$id}/remove-file", [
                'json' => [
                    'file' => $params['file'] ?? null,
                ]
            ]);
            $result = json_decode($response->getBody()->getContents(), true);
            return $result;
        } catch (\Exception $e) {
            throw new \RuntimeException('Failed to remove file', 0, $e);
        }
    }
}