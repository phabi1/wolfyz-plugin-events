
export type ParticipantFormValue = {
    ticket_id?: number;
    firstname?: string;
    lastname?: string;
    birthdate?: string;
};

function getIdentityKey(participant?: ParticipantFormValue): string {
    const firstname = (participant?.firstname ?? '').trim().toLowerCase();
    const lastname = (participant?.lastname ?? '').trim().toLowerCase();
    const birthdate = (participant?.birthdate ?? '').trim();
    return `${firstname}|${lastname}|${birthdate}`;
}

export function findChangedParticipantIndex(
    previousParticipants: ParticipantFormValue[],
    nextParticipants: ParticipantFormValue[]
): number {
    const maxLength = Math.max(previousParticipants.length, nextParticipants.length);

    for (let index = 0; index < maxLength; index += 1) {
        if (getIdentityKey(previousParticipants[index]) !== getIdentityKey(nextParticipants[index])) {
            return index;
        }
    }

    return -1;
}

export async function validateParticipantIdentityAsync(
    participants: ParticipantFormValue[],
    targetIndex: number
): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 180));

    const target = participants[targetIndex];
    if (!target) {
        return false;
    }

    if (!target.ticket_id) {
        return false;
    }

    const targetKey = getIdentityKey(target);
    if (targetKey === '||') {
        return false;
    }

    return participants.some((participant, index) => {
        if (index === targetIndex) {
            return false;
        }

        if (participant?.ticket_id !== target.ticket_id) {
            return false;
        }

        return getIdentityKey(participant) === targetKey;
    });
}
