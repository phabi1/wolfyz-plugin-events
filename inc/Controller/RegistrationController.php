<?php

namespace Wolf\Events\Controller;

use Wolf\Core\Mvc\Controller\AbstractController;

class RegistrationController extends AbstractController
{
    public function infoAction($request)
    {
        $eventId = (int) $request->get_param('event_id');

        $useCaseBus = $this->getService('wolf.use_case_bus');

        try {
            $res = $useCaseBus->execute('wolf-events.get_event', ['id' => $eventId]);
        } catch (\Exception $e) {
            return new \WP_Error('event_not_found', 'Event not found', ['status' => 404]);
        }

        return $res;
    }

    public function registerAction($request)
    {
        $eventId = (int) $request->get_param('event_id');
        $data = $request->get_json_params();

        $contact = $data['contact'] ?? [];

        if (empty($contact['firstname']) || empty($contact['lastname']) || empty($contact['email'])) {
            return new \WP_Error('invalid_data', 'Prénom, nom et email sont obligatoires', ['status' => 400]);
        }

        if (!is_email($contact['email'])) {
            return new \WP_Error('invalid_email', 'Adresse email invalide', ['status' => 400]);
        }

        $participants = $data['participants'] ?? [];
        if (empty($participants)) {
            return new \WP_Error('no_participants', 'Aucun participant fourni', ['status' => 400]);
        }

        foreach ($participants as $participant) {
            if (empty($participant['firstname']) || empty($participant['lastname'])) {
                return new \WP_Error('invalid_participant', 'Prénom et nom sont obligatoires pour chaque participant', ['status' => 400]);
            }
        }

        $useCaseBus = $this->getService('wolf.use_case_bus');

        try {
            $result = $useCaseBus->execute('wolf-events.register_to_event', [
                'event_id' => $eventId,
                'contact' => $contact,
                'participants' => $participants,
            ]);

            return [
                'success' => true,
                'payment_url' => $result['payment_url'] ?? null
            ];
        } catch (\Exception $e) {
            return new \WP_Error('registration_error', $e->getMessage(), ['status' => 400]);
        }


    }

    public function uploadFileAction($request)
    {
        $eventId = (int) $request->get_param('event_id');
        $file = $request->get_json_params()['file'] ?? null;
        $mimeType = $request->get_json_params()['mime_type'] ?? null;

        $res = $this->getService('wolf.use_case_bus')->execute('wolf-events.upload_file', [
            'id' => $eventId,
            'file' => $file,
            'mime_type' => $mimeType
        ]);

        return $res;
    }

    public function removeFileAction($request)
    {
        $eventId = (int) $request->get_param('event_id');
        $file = $request->get_json_params()['file'] ?? null;

        $res = $this->getService('wolf.use_case_bus')->execute('wolf-events.remove_file', ['id' => $eventId, 'file' => $file]);

        return $res;
    }

    public function downloadFileAction($request)
    {
        $eventId = (int) $request->get_param('event_id');
        $file = $request->get_json_params()['file'] ?? null;

        $res = $this->getService('wolf.use_case_bus')->execute('wolf-events.download_file', ['id' => $eventId, 'file' => $file]);

        return $res;
    }
}