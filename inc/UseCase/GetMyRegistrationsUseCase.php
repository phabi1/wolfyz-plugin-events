<?php

namespace Wolf\Events\UseCase;

use GuzzleHttp\Exception\ClientException;
use Wolf\Api\ClientFactory;
use Wolf\Core\UseCase\UseCaseInterface;
use Wolf\Events\Auth\CurrentUser;

/**
 * Event registrations of the signed-in user, read from the club API with the
 * user's own access token (the API limits the data to them).
 */
class GetMyRegistrationsUseCase implements UseCaseInterface
{
    public function execute(array $params = [])
    {
        $token = CurrentUser::accessToken();
        if ($token === null) {
            return new \WP_Error('not_connected', 'Connexion au compte du club requise.', ['status' => 401]);
        }

        try {
            $response = ClientFactory::createForUser($token)->get('/event/me/registrations');
        } catch (ClientException $e) {
            $status = $e->getResponse()->getStatusCode();
            if ($status === 401 || $status === 403) {
                return new \WP_Error('not_connected', 'Connexion au compte du club requise.', ['status' => 401]);
            }
            return new \WP_Error('api_error', 'Impossible de charger vos inscriptions.', ['status' => 502]);
        } catch (\Throwable) {
            return new \WP_Error('api_error', 'Impossible de charger vos inscriptions.', ['status' => 502]);
        }

        $data = json_decode((string) $response->getBody(), true);

        return ['items' => is_array($data['items'] ?? null) ? $data['items'] : []];
    }
}
