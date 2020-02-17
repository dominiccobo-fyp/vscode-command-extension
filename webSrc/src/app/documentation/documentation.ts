export class DocTopic {

  constructor(public readonly topic: string) {}
}

export class Documentation {

  constructor(public readonly title: string,
              public readonly link: string,
              public readonly content: string,
              public readonly lastActivity: string[] = [],
              public readonly topic: DocTopic[] = [])
  {}
}
