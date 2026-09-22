<?php

namespace Wolf\Events\UseCase;

use Wolf\Core\UseCase\UseCaseInterface;
use GuzzleHttp\Client;

class CheckMemberExistsUseCase implements UseCaseInterface
{
    private Client $client;

    public function __construct(Client $client)
    {
        $this->client = $client;
    }

    public function execute(array $params = [])
    {
        $eventId = $params['event_id'];
        $lastname = trim((string) ($params['lastname'] ?? ''));
        $firstname = trim((string) ($params['firstname'] ?? ''));
        $birthdate = trim((string) ($params['birthdate'] ?? ''));

        if ($lastname === '' || $firstname === '' || $birthdate === '') {
            throw new \InvalidArgumentException('Lastname, firstname and birthdate are required');
        }

        try {
            $response = $this->client->post('/event/registration/' . $eventId . '/check-subscription', [
                'json' => [
                    'lastname' => $lastname,
                    'firstname' => $firstname,
                    'birthdate' => $birthdate,
                ],
            ]);

            $data = json_decode($response->getBody()->getContents(), true);

            return [
                'exists' => (bool) ($data['valid'] ?? false),
            ];
        } catch (\Exception $e) {
            var_dump($e->getMessage());
            throw new \RuntimeException('Failed to check member existence', 0, $e);
        }
    }
}
