import { Participant as ParticipantType } from "../../../models/participant";
import { Ticket } from "../../../models/ticket";
import { TicketField } from "../../../models/ticket-field";
import { formatPrice } from "../../../helpers";
import { DetailItem, Details } from "../../ui/Details";
import { YesNo } from "../../ui/YesNo";
import { Address } from "../../ui/Address";
import { File } from "../../ui/File";

function ParticipantField({ field, value }: { field: TicketField, value: any }) {
    switch (field.type) {
        case "text":
        case "phone":
            return (
                <>{value}</>
            );
        case "number":
            return (
                <>{value}</>
            );
        case "boolean":
            return (
                <YesNo value={value} />
            );
        case "file":
            return (
                <File value={value}></File>
            );
        case "address":
            return (
                <Address address={value} />
            );
        case "date":
            return (
                <>{value}</>
            );
        case "options":
            return (
                <>{Array.isArray(value) ? value.join(', ') : value}</>
            );
        default:
            return <></>;
    }
}

export function Participant({ participant, ticket }: { participant: ParticipantType; ticket: Ticket }) {
    return (
        <div className="participant-card">
            <div className="participant-card-header">
                <h3>{participant.firstname} {participant.lastname}</h3>
                {ticket && (
                    <p>{ticket.title} ({formatPrice(ticket.amount)})</p>
                )}
            </div>
            <div className="participant-card-body">
                <Details cols={2}>
                    <DetailItem label="Date de naissance">
                        {participant.birthdate}
                    </DetailItem>
                    {ticket.fields && ticket.fields.map((field, index) => (
                        <DetailItem key={index} label={field.label}>
                            <ParticipantField field={field} value={participant.fields?.[field.id]} />
                        </DetailItem>
                    ))}
                </Details>
            </div>
        </div>
    );
}