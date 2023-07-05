const MAX_LENGTH = 20

export const FormatName = (name: string, maxLength?: number) =>
    name
        .split("@")[0]
        .split(RegExp("[ .,]+"))
        .map(word =>
            word.length < 3
                ? word
                : word.charAt(0).toUpperCase() +
                  word.slice(1).toLocaleLowerCase(),
        )
        .join(" ")
        .substring(0, maxLength ?? MAX_LENGTH)
