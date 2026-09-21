<?php
/**
 * PHP file to use when rendering the block type on the server to show on the front end.
 *
 * The following variables are exposed to the file:
 *     $attributes (array): The block attributes.
 *     $content (string): The block default content.
 *     $block (WP_Block): The block instance.
 *
 * @see https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/block-api/block-metadata.md#render
 */
?>

<?php
$type = isset($_GET['type']) ? sanitize_key(wp_unslash($_GET['type'])) : '';
$checkoutId = absint($_GET['checkout_id'] ?? 0);

$results = array(
	'success' => array(
		'tone' => 'success',
		'label' => __('Paiement confirme', 'result'),
		'title' => __('Inscription confirmee', 'result'),
		'message' => __('Merci, votre paiement a ete recu et votre inscription est validee.', 'result'),
	),
	'pending' => array(
		'tone' => 'pending',
		'label' => __('Paiement en attente', 'result'),
		'title' => __('Verification en cours', 'result'),
		'message' => __('Nous attendons la confirmation du prestataire de paiement. Vous recevrez une confirmation sous peu.', 'result'),
	),
	'cancel' => array(
		'tone' => 'cancelled',
		'label' => __('Paiement annule', 'result'),
		'title' => __('Aucun debit effectue', 'result'),
		'message' => __('Le paiement a ete annule avant sa finalisation. Vous pouvez relancer le paiement quand vous voulez.', 'result'),
	),
	'cancelled' => array(
		'tone' => 'cancelled',
		'label' => __('Paiement annule', 'result'),
		'title' => __('Aucun debit effectue', 'result'),
		'message' => __('Le paiement a ete annule avant sa finalisation. Vous pouvez relancer le paiement quand vous voulez.', 'result'),
	),
	'failed' => array(
		'tone' => 'error',
		'label' => __('Paiement refuse', 'result'),
		'title' => __('Le paiement a echoue', 'result'),
		'message' => __('Votre paiement a ete refuse ou interrompu. Merci de reessayer avec un autre moyen de paiement.', 'result'),
	),
	'error' => array(
		'tone' => 'error',
		'label' => __('Paiement refuse', 'result'),
		'title' => __('Le paiement a echoue', 'result'),
		'message' => __('Votre paiement a ete refuse ou interrompu. Merci de reessayer avec un autre moyen de paiement.', 'result'),
	),
);

$result = $results[$type] ?? array(
	'tone' => 'invalid',
	'label' => __('Reponse invalide', 'result'),
	'title' => __('Le retour de paiement est invalide', 'result'),
	'message' => __('Le lien de retour paiement est incomplet. Merci de relancer le paiement depuis la page evenement.', 'result'),
);

$role = $result['tone'] === 'error' || $result['tone'] === 'invalid' ? 'alert' : 'status';
?>

<div <?php echo get_block_wrapper_attributes(array('class' => 'wolf-events-payment-result-wrapper')); ?>>
	<div class="wolf-events-payment-result-card is-<?php echo esc_attr($result['tone']); ?>" role="<?php echo esc_attr($role); ?>">
		<p class="wolf-events-payment-result-label"><?php echo esc_html($result['label']); ?></p>
		<h2 class="wolf-events-payment-result-title"><?php echo esc_html($result['title']); ?></h2>
		<p class="wolf-events-payment-result-message"><?php echo esc_html($result['message']); ?></p>

		<?php if ($checkoutId > 0) : ?>
			<p class="wolf-events-payment-result-reference">
				<?php
				echo esc_html(
					sprintf(
						/* translators: %d is the checkout identifier. */
						__('Reference paiement: #%d', 'result'),
						$checkoutId
					)
				);
				?>
			</p>
		<?php endif; ?>
	</div>
</div>