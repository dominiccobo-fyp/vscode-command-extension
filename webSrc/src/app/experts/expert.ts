export class ContactDetails {
  constructor(public readonly meansName: string, public readonly details: string) {
  }
}

export class ExpertTopic {
  constructor(public readonly expertTopic: string, public readonly details: string) {}
}

export class Expert {
  constructor(public readonly expertName: string, public readonly contactDetails: ContactDetails[] = [], public readonly expertTopics: ExpertTopic[]) {
  }
}
