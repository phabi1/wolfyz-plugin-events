<?php

namespace Wolf\Events\Auth;

/**
 * Account of the signed-in WordPress user on the auth server, as stored by the
 * OpenID Connect login plugin (daggerhart-openid-connect-generic).
 */
class CurrentUser
{
    /** Auth server user id ("sub"), or null when not signed in through it. */
    public static function subject(): ?string
    {
        if (!is_user_logged_in()) {
            return null;
        }
        $subject = get_user_option('openid-connect-generic-subject-identity', get_current_user_id());

        return is_string($subject) && $subject !== '' ? $subject : null;
    }

    /**
     * Access token of the user for the club API (kept fresh by the login
     * plugin on every request), or null.
     */
    public static function accessToken(): ?string
    {
        if (!is_user_logged_in()) {
            return null;
        }
        $userId = get_current_user_id();
        $response = get_user_option('openid-connect-generic-last-token-response', $userId);
        if (!is_array($response)) {
            $response = get_user_meta($userId, 'openid-connect-generic-last-token-response', true);
        }
        if (!is_array($response) || empty($response['access_token'])) {
            return null;
        }
        if (!empty($response['time']) && !empty($response['expires_in'])
            && time() >= (int) $response['time'] + (int) $response['expires_in']) {
            return null; // expired and not refreshed: the user must sign in again
        }

        return (string) $response['access_token'];
    }
}
