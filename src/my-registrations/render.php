<?php
/**
 * "My registrations": event registrations of the signed-in user, loaded by
 * view.js from the wolf-events/v1/me/registrations REST route.
 */

if (!defined('ABSPATH')) {
	exit;
}

$wrapper_attributes = get_block_wrapper_attributes([
	'class' => 'wp-block-wolf-events-my-registrations',
]);

if (!is_user_logged_in()) {
	$login_url = wp_login_url(get_permalink() ?: home_url());
	?>
	<div <?php echo $wrapper_attributes; ?>>
		<p class="we-my-registrations__message">
			<?php esc_html_e('Connectez-vous avec votre compte du club pour voir vos inscriptions.', 'wolf-events'); ?>
		</p>
		<p>
			<a class="we-my-registrations__login" href="<?php echo esc_url($login_url); ?>">
				<?php esc_html_e('Se connecter', 'wolf-events'); ?>
			</a>
		</p>
	</div>
	<?php
	return;
}
?>
<div
	<?php echo $wrapper_attributes; ?>
	data-nonce="<?php echo esc_attr(wp_create_nonce('wp_rest')); ?>"
	data-login-url="<?php echo esc_url(wp_login_url(get_permalink() ?: home_url())); ?>"
></div>
