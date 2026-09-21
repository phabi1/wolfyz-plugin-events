<?php

if (!defined('ABSPATH')) {
	exit;
}

$event_id = isset($_GET['event_id']) ? (int) $_GET['event_id'] : 0;
$rest_nonce = wp_create_nonce('wp_rest');
$wrapper_attributes = get_block_wrapper_attributes([
	'class' => 'wp-block-wolf-events-registration-form',
]);
?>
<div
	<?php echo $wrapper_attributes; ?>
	data-event-id="<?php echo esc_attr($event_id); ?>"
	data-nonce="<?php echo esc_attr($rest_nonce); ?>"
></div>
