export class Groups {
  public static readonly READ = 'read';
  public static readonly CREATE = 'create';
  public static readonly UPDATE = 'update';

  public static all() {
    return [this.READ, this.CREATE, this.UPDATE];
  }
}
