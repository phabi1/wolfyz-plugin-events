import { registerBlockType } from '@wordpress/blocks';
import './style.scss';
import Edit from './edit';
import metadata from './block.json';

// Dynamic block: rendered by render.php, nothing saved in the content.
registerBlockType( metadata.name, {
	edit: Edit,
	save: () => null,
} );
