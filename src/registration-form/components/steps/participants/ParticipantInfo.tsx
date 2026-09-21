import { __ } from '@wordpress/i18n';
import { TEXT_DOMAIN } from '../../../constants';
import { formatPrice, getTicketById } from '../../../helpers.ts';
import type { Ticket } from '../../../models/ticket';
import type { Participant } from '../../../models/participant';
import { TextField } from '../../form/fields/TextField';
import { ParticipantFields } from './ParticipantFields';

export function ParticipantInfo({ participant, index, tickets, control, eventId }: {
    participant: Participant;
    index: number;
    tickets: Ticket[];
    control: any;
    eventId: number;
}) {
    const ticket = getTicketById(tickets, participant.ticket_id);

    return (
        <article className="participant-card">
            <header className="participant-card-header">
                <h4>
                    {__('Participant', TEXT_DOMAIN)} {index + 1}
                </h4>
                <p>
                    {ticket?.title} - {formatPrice(ticket?.amount || 0)}
                </p>
            </header>

            <div className="we-registration__grid">
                <TextField
                    name={`participants.${index}.firstname`}
                    label={__('Prenom', TEXT_DOMAIN)}
                    required
                    control={control}
                />

                <TextField
                    name={`participants.${index}.lastname`}
                    label={__('Nom', TEXT_DOMAIN)}
                    required
                    control={control}
                />

                <TextField
                    name={`participants.${index}.birthdate`}
                    label={__('Date de naissance', TEXT_DOMAIN)}
                    required
                    control={control}
                />
            </div>
            <ParticipantFields
                index={index}
                fields={ticket?.fields ?? []}
                control={control}
                eventId={eventId}
            />
        </article>
    );
}
