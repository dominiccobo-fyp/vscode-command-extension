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



  public containsFilterTerm(filterTerm: string) {
    let filterBy = filterTerm.toLocaleLowerCase();
    return this.containsTitle(filterBy) || this.containsTopic(filterBy) ||
        this.containsSimilarContent(filterBy) || this.containsSimilarLink(filterBy);
  }

  private containsSimilarLink(filterTerm: string) {
    return this.link.toLocaleLowerCase().includes(filterTerm);
  }

  private containsSimilarContent(filterTerm: string) {
    return this.content.toLocaleLowerCase().includes(filterTerm);
  }

  private containsTopic(filterTerm: string) {
    return this.topic.join(',').toLocaleLowerCase().includes(filterTerm);
  }

  private containsTitle(filterTerm: string) {
    return this.title.toLocaleLowerCase().includes(filterTerm);
  }
}
