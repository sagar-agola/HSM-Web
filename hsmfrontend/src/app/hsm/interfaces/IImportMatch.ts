export class IImportForm{
    name: string;
    mappedName: string;
    displayName: string;
    disabled: boolean = false;
    isSelected: boolean = false;
    buttonDisabled: boolean = true;
    buttonState: string = "Confirm";
    ignoreDisabled: boolean = false;
    ignorebuttonDisabled: boolean = false;
    ignorebuttonState: string = "Ignore";
    data: string[] = [];
}