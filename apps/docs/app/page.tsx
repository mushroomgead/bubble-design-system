"use client";

import {
  Alert,
  Avatar,
  Badge,
  Button,
  Card,
  ChatCompose,
  ChatDateDivider,
  ChatMessage,
  ChatThread,
  Checkbox,
  CommandPalette,
  type CommandPaletteGroup,
  Container,
  DataTable,
  type DataTableColumn,
  Divider,
  DropdownMenu,
  Grid,
  Input,
  Modal,
  Popover,
  Radio,
  RadioGroup,
  Segmented,
  Select,
  Skeleton,
  StatusPill,
  Switch,
  Tabs,
  Textarea,
  Toast,
  Tooltip,
  useCommandPalette,
  useToast,
} from "@bubble-design-system/ui";
import Link from "next/link";
import { useRef, useState } from "react";
import { ThemeBar } from "./ThemeBar";

const buttonVariants = [
  "primary",
  "secondary",
  "destructive",
  "ghost",
] as const;
const sizes = ["sm", "md", "lg"] as const;
const badgeVariants = [
  "neutral",
  "brand",
  "success",
  "warning",
  "danger",
] as const;
const alertVariants = ["info", "success", "warning", "danger"] as const;

interface UserRow {
  id: number;
  name: string;
  email: string;
  role: string;
  status: "Active" | "Invited" | "Suspended";
  lastSeen: string;
}

const userRows: UserRow[] = [
  {
    id: 1,
    name: "Ava Thompson",
    email: "ava@bubble.dev",
    role: "Admin",
    status: "Active",
    lastSeen: "2 min ago",
  },
  {
    id: 2,
    name: "Liam Park",
    email: "liam@bubble.dev",
    role: "Editor",
    status: "Active",
    lastSeen: "1 hr ago",
  },
  {
    id: 3,
    name: "Sofia Reyes",
    email: "sofia@bubble.dev",
    role: "Editor",
    status: "Invited",
    lastSeen: "—",
  },
  {
    id: 4,
    name: "Noah Becker",
    email: "noah@bubble.dev",
    role: "Viewer",
    status: "Active",
    lastSeen: "3 hr ago",
  },
  {
    id: 5,
    name: "Maya Chen",
    email: "maya@bubble.dev",
    role: "Admin",
    status: "Active",
    lastSeen: "5 min ago",
  },
  {
    id: 6,
    name: "Ethan Wright",
    email: "ethan@bubble.dev",
    role: "Viewer",
    status: "Suspended",
    lastSeen: "2 days ago",
  },
  {
    id: 7,
    name: "Priya Nair",
    email: "priya@bubble.dev",
    role: "Editor",
    status: "Active",
    lastSeen: "30 min ago",
  },
  {
    id: 8,
    name: "Owen Clark",
    email: "owen@bubble.dev",
    role: "Viewer",
    status: "Invited",
    lastSeen: "—",
  },
  {
    id: 9,
    name: "Isla Murphy",
    email: "isla@bubble.dev",
    role: "Editor",
    status: "Active",
    lastSeen: "1 day ago",
  },
  {
    id: 10,
    name: "Leo Santos",
    email: "leo@bubble.dev",
    role: "Viewer",
    status: "Active",
    lastSeen: "4 hr ago",
  },
  {
    id: 11,
    name: "Grace Kim",
    email: "grace@bubble.dev",
    role: "Admin",
    status: "Active",
    lastSeen: "12 min ago",
  },
  {
    id: 12,
    name: "Jonas Weber",
    email: "jonas@bubble.dev",
    role: "Viewer",
    status: "Suspended",
    lastSeen: "1 week ago",
  },
];

const statusIntent: Record<UserRow["status"], "success" | "info" | "danger"> = {
  Active: "success",
  Invited: "info",
  Suspended: "danger",
};

const userColumns: DataTableColumn<UserRow>[] = [
  {
    key: "name",
    label: "Name",
    render: (_value, row) => (
      <div className="pds-datatable__cell-user">
        <Avatar size="sm">
          <Avatar.Fallback>
            {row.name
              .split(" ")
              .map((part) => part[0])
              .join("")}
          </Avatar.Fallback>
        </Avatar>
        <div className="pds-datatable__cell-user-info">
          <span className="pds-datatable__cell-user-name">{row.name}</span>
          <span className="pds-datatable__cell-user-sub">{row.email}</span>
        </div>
      </div>
    ),
  },
  { key: "role", label: "Role" },
  {
    key: "status",
    label: "Status",
    render: (value) => {
      const status = value as UserRow["status"];
      return (
        <StatusPill intent={statusIntent[status]}>
          <StatusPill.Indicator />
          <StatusPill.Label>{status}</StatusPill.Label>
        </StatusPill>
      );
    },
  },
  { key: "lastSeen", label: "Last seen", muted: true, mono: true },
];

const commandGroups: CommandPaletteGroup[] = [
  {
    label: "Navigation",
    items: [
      {
        id: "dashboard",
        label: "Go to Dashboard",
        description: "Overview & metrics",
        shortcut: "G+D",
      },
      {
        id: "users",
        label: "Go to Users",
        description: "Manage members & roles",
        shortcut: "G+U",
      },
      {
        id: "settings",
        label: "Go to Settings",
        description: "Workspace preferences",
        shortcut: "G+S",
      },
    ],
  },
  {
    label: "Actions",
    items: [
      {
        id: "invite",
        label: "Invite member",
        description: "Send a workspace invite",
        shortcut: "⌘+I",
      },
      {
        id: "new-project",
        label: "New project",
        description: "Create an empty project",
        shortcut: "⌘+N",
      },
      {
        id: "export",
        label: "Export data",
        description: "Download the current view as CSV",
      },
    ],
  },
];

function ToastDemo() {
  const toast = useToast();
  return (
    <div className="docs-row-tight">
      <Button
        variant="secondary"
        onClick={() =>
          toast.add({
            title: "Saved",
            description: "Your changes have been saved successfully.",
          })
        }
      >
        Fire toast
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          toast.add({
            title: "Heads up",
            description: "This will auto-dismiss in 5 seconds.",
            timeout: 5000,
          })
        }
      >
        With timeout
      </Button>
      <Button
        variant="ghost"
        onClick={() => toast.add({ description: "Description-only toast" })}
      >
        No title
      </Button>
    </div>
  );
}

interface ChatDemoMessage {
  id: number;
  text: string;
}

function ChatDemo() {
  const [messages, setMessages] = useState<ChatDemoMessage[]>([]);
  const nextId = useRef(1);

  function handleSend(text: string) {
    setMessages((prev) => [...prev, { id: nextId.current++, text }]);
  }

  return (
    <div className="docs-chat-frame">
      <div className="docs-chat-frame__bar">
        <Avatar size="sm">
          <Avatar.Fallback>LT</Avatar.Fallback>
        </Avatar>
        <span className="docs-chat-frame__bar-name">Lena Torres</span>
        <StatusPill intent="success">
          <StatusPill.Indicator />
          <StatusPill.Label>Online</StatusPill.Label>
        </StatusPill>
        <span className="docs-chat-frame__bar-sub">Bubble · chat</span>
      </div>

      <ChatThread style={{ flex: 1 }}>
        <ChatDateDivider>Today</ChatDateDivider>

        <ChatMessage
          side="received"
          position="first"
          name="Lena Torres"
          time="10:41 AM"
        >
          Hey! Just pushed the new design tokens to main. Can you take a look?
        </ChatMessage>
        <ChatMessage
          side="received"
          position="last"
          name="Lena Torres"
          avatar={
            <Avatar size="sm">
              <Avatar.Fallback>LT</Avatar.Fallback>
            </Avatar>
          }
          reactions={[{ emoji: "👍", count: 2, mine: true }, { emoji: "🔥" }]}
        >
          Specifically the soft-tone shadow values — they look a bit heavy on
          mobile.
        </ChatMessage>

        <ChatMessage side="sent" position="solo" time="10:44 AM" status="read">
          On it — I&apos;ll adjust the md shadow to use a lower blur on small
          viewports.
        </ChatMessage>
        <ChatMessage side="sent" position="first" time="10:45 AM">
          Also bumping card border-radius from xl → 2xl on mobile.
        </ChatMessage>
        <ChatMessage side="sent" position="last" status="sent">
          PR up in a few minutes
        </ChatMessage>

        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            side="sent"
            position="solo"
            time="Just now"
            status="sending"
          >
            {message.text}
          </ChatMessage>
        ))}
      </ChatThread>

      <ChatCompose
        avatar={
          <Avatar size="sm">
            <Avatar.Fallback>AK</Avatar.Fallback>
          </Avatar>
        }
        placeholder="Write a message… (Shift+Enter for new line)"
        onSend={handleSend}
      />
    </div>
  );
}

export default function HomePage() {
  const [radioVal, setRadioVal] = useState<unknown>("comfortable");
  const [checkA, setCheckA] = useState(true);
  const [checkB, setCheckB] = useState(false);
  const [segVal, setSegVal] = useState("day");
  const commandPalette = useCommandPalette();
  return (
    <Toast.Provider>
      <Tooltip.Provider>
        <main className="docs-main">
          <ThemeBar />
          <header className="docs-page-header">
            <h1 className="docs-h1">Plain DS</h1>
            <p className="docs-muted">
              Component gallery — verifying tokens render as expected. Use the
              bar above to switch theme, brand, radius, density, gray family, or
              font live.
            </p>
            <p className="docs-text-sm">
              <Link href="/tokens" className="docs-link">
                Design tokens reference →
              </Link>
            </p>
          </header>

          <section className="docs-section">
            <h2 className="docs-h2">Button · variants × sizes</h2>
            <div className="docs-section-rows">
              {buttonVariants.map((variant) => (
                <div key={variant} className="docs-variant-row">
                  <span className="docs-variant-label">{variant}</span>
                  {sizes.map((size) => (
                    <Button key={size} variant={variant} size={size}>
                      {size === "sm"
                        ? "Small"
                        : size === "md"
                          ? "Medium"
                          : "Large"}
                    </Button>
                  ))}
                </div>
              ))}
            </div>
          </section>

          <section className="docs-section">
            <h2 className="docs-h2">Input</h2>
            <div className="docs-grid-3">
              {sizes.map((size) => (
                <Input key={size} size={size} placeholder={`Size ${size}`} />
              ))}
            </div>
            <div className="docs-grid-3">
              <Input placeholder="Default" />
              <Input placeholder="Disabled" disabled />
              <Input placeholder="Invalid" invalid defaultValue="bad@" />
            </div>
          </section>

          <section className="docs-section">
            <h2 className="docs-h2">Checkbox</h2>
            <div className="docs-row-wide">
              {sizes.map((size) => (
                <label key={size} className="docs-inline-label">
                  <Checkbox size={size} defaultChecked />
                  <span>{size}</span>
                </label>
              ))}
            </div>
            <div className="docs-row-wide">
              <label className="docs-inline-label">
                <Checkbox />
                <span>Unchecked</span>
              </label>
              <label className="docs-inline-label">
                <Checkbox defaultChecked />
                <span>Checked</span>
              </label>
              <label className="docs-inline-label">
                <Checkbox indeterminate />
                <span>Indeterminate</span>
              </label>
              <label className="docs-inline-label docs-inline-label--disabled">
                <Checkbox disabled />
                <span>Disabled</span>
              </label>
            </div>
          </section>

          <section className="docs-section">
            <h2 className="docs-h2">Radio</h2>
            <RadioGroup
              defaultValue="m"
              style={{ flexDirection: "row", gap: "1.5rem" }}
            >
              {sizes.map((size) => (
                <label key={size} className="docs-inline-label">
                  <Radio size={size} value={size[0]} />
                  <span>{size}</span>
                </label>
              ))}
            </RadioGroup>
          </section>

          <section className="docs-section">
            <h2 className="docs-h2">Switch</h2>
            <div className="docs-row-wide">
              {sizes.map((size) => (
                <label key={size} className="docs-inline-label">
                  <Switch size={size} defaultChecked />
                  <span>{size}</span>
                </label>
              ))}
            </div>
          </section>

          <section className="docs-section">
            <h2 className="docs-h2">Select</h2>
            <div className="docs-grid-3">
              {sizes.map((size) => (
                <Select.Root key={size} defaultValue="">
                  <Select.Trigger size={size}>
                    <Select.Value placeholder={`Size ${size}`} />
                  </Select.Trigger>
                  <Select.Content>
                    <Select.Item value="apple">Apple</Select.Item>
                    <Select.Item value="banana">Banana</Select.Item>
                    <Select.Item value="cherry">Cherry</Select.Item>
                    <Select.Item value="grape" disabled>
                      Grape (disabled)
                    </Select.Item>
                  </Select.Content>
                </Select.Root>
              ))}
            </div>
          </section>

          <section className="docs-section">
            <h2 className="docs-h2">Badge</h2>
            <div className="docs-section-stack-tight">
              {badgeVariants.map((variant) => (
                <div key={variant} className="docs-row-tight">
                  <span className="docs-variant-label">{variant}</span>
                  <Badge variant={variant} size="sm">
                    Small
                  </Badge>
                  <Badge variant={variant} size="md">
                    Medium
                  </Badge>
                  <Badge variant={variant} size="lg">
                    Large
                  </Badge>
                </div>
              ))}
            </div>
          </section>

          <section className="docs-section">
            <h2 className="docs-h2">Avatar</h2>
            <div className="docs-row">
              <Avatar size="sm">
                <Avatar.Fallback>KK</Avatar.Fallback>
              </Avatar>
              <Avatar size="md">
                <Avatar.Fallback>KK</Avatar.Fallback>
              </Avatar>
              <Avatar size="lg">
                <Avatar.Fallback>KK</Avatar.Fallback>
              </Avatar>
              <Avatar size="xl">
                <Avatar.Fallback>KK</Avatar.Fallback>
              </Avatar>
              <Avatar size="lg">
                <Avatar.Image
                  src="https://i.pravatar.cc/120?img=12"
                  alt="User"
                />
                <Avatar.Fallback delay={600}>JD</Avatar.Fallback>
              </Avatar>
            </div>
          </section>

          <section className="docs-section">
            <h2 className="docs-h2">Divider</h2>
            <div className="docs-section-stack-tight">
              <p className="docs-text-sm">Above</p>
              <Divider />
              <p className="docs-text-sm">Below</p>
            </div>
            <div className="docs-vertical-divider-host">
              <span className="docs-text-sm">Left</span>
              <Divider orientation="vertical" />
              <span className="docs-text-sm">Middle</span>
              <Divider orientation="vertical" />
              <span className="docs-text-sm">Right</span>
            </div>
          </section>

          <section className="docs-section">
            <h2 className="docs-h2">Alert</h2>
            <div
              className="docs-section-stack-tight"
              style={{ maxWidth: "42rem" }}
            >
              {alertVariants.map((variant) => (
                <Alert
                  key={variant}
                  variant={variant}
                  title={`${variant} alert`}
                >
                  Token-driven background, border, and icon color via{" "}
                  <code className="docs-mono">--color-bg-{variant}</code> /{" "}
                  <code className="docs-mono">--color-text-{variant}</code>.
                </Alert>
              ))}
            </div>
          </section>

          <section className="docs-section">
            <h2 className="docs-h2">Modal</h2>
            <Modal.Root>
              <Modal.Trigger
                render={(props) => <Button {...props}>Open modal</Button>}
              />
              <Modal.Content>
                <Modal.Title>Confirm deletion</Modal.Title>
                <Modal.Description>
                  This action can&apos;t be undone. The selected items will be
                  removed from your workspace.
                </Modal.Description>
                <div className="docs-modal-actions">
                  <Modal.Close
                    render={(props) => (
                      <Button {...props} variant="ghost">
                        Cancel
                      </Button>
                    )}
                  />
                  <Modal.Close
                    render={(props) => (
                      <Button {...props} variant="destructive">
                        Delete
                      </Button>
                    )}
                  />
                </div>
              </Modal.Content>
            </Modal.Root>
          </section>

          <section className="docs-section">
            <h2 className="docs-h2">Tooltip</h2>
            <div className="docs-row">
              <Tooltip.Root>
                <Tooltip.Trigger
                  render={(props) => (
                    <Button {...props} variant="secondary">
                      Hover me
                    </Button>
                  )}
                />
                <Tooltip.Content>Top tooltip</Tooltip.Content>
              </Tooltip.Root>
              <Tooltip.Root>
                <Tooltip.Trigger
                  render={(props) => (
                    <Button {...props} variant="secondary">
                      Right
                    </Button>
                  )}
                />
                <Tooltip.Content side="right">On the right</Tooltip.Content>
              </Tooltip.Root>
              <Tooltip.Root>
                <Tooltip.Trigger
                  render={(props) => (
                    <Button {...props} variant="secondary">
                      Bottom
                    </Button>
                  )}
                />
                <Tooltip.Content side="bottom">Bottom side</Tooltip.Content>
              </Tooltip.Root>
            </div>
          </section>

          <section className="docs-section">
            <h2 className="docs-h2">Tabs</h2>
            <Tabs defaultValue="overview">
              <Tabs.List>
                <Tabs.Tab value="overview">Overview</Tabs.Tab>
                <Tabs.Tab value="usage">Usage</Tabs.Tab>
                <Tabs.Tab value="settings">Settings</Tabs.Tab>
                <Tabs.Tab value="locked" disabled>
                  Locked
                </Tabs.Tab>
              </Tabs.List>
              <Tabs.Panel value="overview">
                <p className="docs-prose docs-text-sm">
                  Overview panel content. The animated indicator under the
                  active tab uses{" "}
                  <code className="docs-mono">--active-tab-width</code> and{" "}
                  <code className="docs-mono">--active-tab-left</code> CSS vars.
                </p>
              </Tabs.Panel>
              <Tabs.Panel value="usage">
                <p className="docs-prose docs-text-sm">Usage panel content.</p>
              </Tabs.Panel>
              <Tabs.Panel value="settings">
                <p className="docs-prose docs-text-sm">
                  Settings panel content.
                </p>
              </Tabs.Panel>
            </Tabs>
          </section>

          <section className="docs-section">
            <h2 className="docs-h2">Dropdown Menu</h2>
            <DropdownMenu.Root>
              <DropdownMenu.Trigger
                render={(props) => (
                  <Button {...props} variant="secondary">
                    Open menu
                  </Button>
                )}
              />
              <DropdownMenu.Content>
                <DropdownMenu.Item onClick={() => console.log("New")}>
                  New file
                </DropdownMenu.Item>
                <DropdownMenu.Item>Open…</DropdownMenu.Item>
                <DropdownMenu.Item disabled>Save (disabled)</DropdownMenu.Item>
                <DropdownMenu.Separator />
                <DropdownMenu.Group>
                  <DropdownMenu.Label>Toggles</DropdownMenu.Label>
                  <DropdownMenu.CheckboxItem
                    checked={checkA}
                    onCheckedChange={setCheckA}
                  >
                    Show sidebar
                  </DropdownMenu.CheckboxItem>
                  <DropdownMenu.CheckboxItem
                    checked={checkB}
                    onCheckedChange={setCheckB}
                  >
                    Show inspector
                  </DropdownMenu.CheckboxItem>
                </DropdownMenu.Group>
                <DropdownMenu.Separator />
                <DropdownMenu.RadioGroup
                  value={radioVal}
                  onValueChange={setRadioVal}
                >
                  <DropdownMenu.Label>Density</DropdownMenu.Label>
                  <DropdownMenu.RadioItem value="compact">
                    Compact
                  </DropdownMenu.RadioItem>
                  <DropdownMenu.RadioItem value="default">
                    Default
                  </DropdownMenu.RadioItem>
                  <DropdownMenu.RadioItem value="comfortable">
                    Comfortable
                  </DropdownMenu.RadioItem>
                </DropdownMenu.RadioGroup>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </section>

          <section className="docs-section">
            <h2 className="docs-h2">Toast</h2>
            <ToastDemo />
          </section>

          <section className="docs-section">
            <h2 className="docs-h2">Skeleton</h2>
            <div className="docs-skeleton-card">
              <div className="docs-skeleton-row">
                <Skeleton shape="circle" className="docs-skel-circle" />
                <div className="docs-skeleton-grow">
                  <Skeleton className="docs-skel-half" />
                  <Skeleton className="docs-skel-three" />
                </div>
              </div>
              <Skeleton shape="block" className="docs-skel-block" />
            </div>
          </section>

          <section className="docs-section">
            <h2 className="docs-h2">Card · elevated + muted</h2>
            <div className="docs-grid-cards">
              <Card>
                <Card.Header>
                  <div>
                    <Card.Title>Soft-pill surface</Card.Title>
                    <Card.Description>
                      White card floating on the gray page via layered shadow.
                    </Card.Description>
                  </div>
                  <Card.Action>
                    <Button size="sm" variant="ghost">
                      Manage
                    </Button>
                  </Card.Action>
                </Card.Header>
                <Card.Body>
                  Composes from <code className="docs-mono">Card.Header</code>,{" "}
                  <code className="docs-mono">Card.Title</code>,{" "}
                  <code className="docs-mono">Card.Description</code>,{" "}
                  <code className="docs-mono">Card.Action</code>,{" "}
                  <code className="docs-mono">Card.Body</code> and{" "}
                  <code className="docs-mono">Card.Footer</code>.
                </Card.Body>
                <Card.Footer>
                  <Button size="sm" variant="ghost">
                    Cancel
                  </Button>
                  <Button size="sm">Save</Button>
                </Card.Footer>
              </Card>
              <Card variant="muted">
                <Card.Header>
                  <Card.Title>Muted variant</Card.Title>
                </Card.Header>
                <Card.Body>
                  Sits on <code className="docs-mono">bg-secondary</code> with
                  no shadow — useful for nested or supporting panels.
                </Card.Body>
              </Card>
            </div>
          </section>

          <section className="docs-section">
            <h2 className="docs-h2">Textarea</h2>
            <div className="docs-grid-cards docs-grid-cards--three">
              {sizes.map((size) => (
                <Textarea key={size} size={size} placeholder={`Size ${size}`} />
              ))}
            </div>
            <div className="docs-grid-cards docs-grid-cards--three">
              <Textarea placeholder="Default" rows={3} />
              <Textarea placeholder="Disabled" rows={3} disabled />
              <Textarea
                placeholder="Invalid"
                rows={3}
                invalid
                defaultValue="bad input"
              />
            </div>
          </section>

          <section className="docs-section">
            <h2 className="docs-h2">StatusPill</h2>
            <p className="docs-prose docs-text-sm">
              Compound: <code className="docs-mono">StatusPill</code> +{" "}
              <code className="docs-mono">StatusPill.Indicator</code> +{" "}
              <code className="docs-mono">StatusPill.Label</code>. Intent drives
              the chip color and label text via CSS variables.
            </p>
            <div className="docs-row-tight">
              <StatusPill intent="success">
                <StatusPill.Indicator />
                <StatusPill.Label>On track</StatusPill.Label>
              </StatusPill>
              <StatusPill intent="warning">
                <StatusPill.Indicator />
                <StatusPill.Label>At risk</StatusPill.Label>
              </StatusPill>
              <StatusPill intent="danger">
                <StatusPill.Indicator />
                <StatusPill.Label>Blocked</StatusPill.Label>
              </StatusPill>
              <StatusPill intent="info">
                <StatusPill.Indicator />
                <StatusPill.Label>In review</StatusPill.Label>
              </StatusPill>
              <StatusPill intent="neutral">
                <StatusPill.Indicator />
                <StatusPill.Label>Draft</StatusPill.Label>
              </StatusPill>
              <StatusPill intent="success">
                <StatusPill.Indicator>
                  <svg viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path
                      d="M3 6l2 2 4-4.5"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </StatusPill.Indicator>
                <StatusPill.Label>Custom icon</StatusPill.Label>
              </StatusPill>
            </div>
          </section>

          <section className="docs-section">
            <h2 className="docs-h2">Segmented</h2>
            <p className="docs-prose docs-text-sm">
              Compound: <code className="docs-mono">Segmented</code> +{" "}
              <code className="docs-mono">Segmented.Item</code>. Single-select
              toggle group; the selected item rises as a white floating pill.
            </p>
            <div className="docs-row">
              {sizes.map((size) => (
                <Segmented
                  key={size}
                  size={size}
                  value={segVal}
                  onValueChange={setSegVal}
                >
                  <Segmented.Item value="day">Day</Segmented.Item>
                  <Segmented.Item value="week">Week</Segmented.Item>
                  <Segmented.Item value="month">Month</Segmented.Item>
                </Segmented>
              ))}
            </div>
          </section>

          <section className="docs-section">
            <h2 className="docs-h2">Container + Grid</h2>
            <p className="docs-prose docs-text-sm">
              <code className="docs-mono">Container</code> centers content and
              applies page margins. <code className="docs-mono">Grid</code> is a
              12-column grid with token-driven gutters;{" "}
              <code className="docs-mono">Grid.Col</code> spans columns with
              optional responsive overrides.
            </p>
            <Container size="lg" className="docs-container-flush">
              <Grid>
                <Grid.Col span={12}>
                  <div className="docs-grid-demo-cell">span=12</div>
                </Grid.Col>
                <Grid.Col span={6} lgSpan={4}>
                  <div className="docs-grid-demo-cell">span=6 · lgSpan=4</div>
                </Grid.Col>
                <Grid.Col span={6} lgSpan={4}>
                  <div className="docs-grid-demo-cell">span=6 · lgSpan=4</div>
                </Grid.Col>
                <Grid.Col span={12} lgSpan={4}>
                  <div className="docs-grid-demo-cell">span=12 · lgSpan=4</div>
                </Grid.Col>
              </Grid>
            </Container>
          </section>

          <section className="docs-section">
            <h2 className="docs-h2">Popover</h2>
            <p className="docs-prose docs-text-sm">
              Compound: <code className="docs-mono">Popover.Root</code> +{" "}
              <code className="docs-mono">Popover.Trigger</code> +{" "}
              <code className="docs-mono">Popover.Content</code>, with optional{" "}
              <code className="docs-mono">Header</code>/
              <code className="docs-mono">Body</code>/
              <code className="docs-mono">Footer</code> slots and an anchored
              arrow.
            </p>
            <Popover.Root>
              <Popover.Trigger
                render={(props) => (
                  <Button {...props} variant="secondary">
                    Columns
                  </Button>
                )}
              />
              <Popover.Content>
                <Popover.Header>
                  <Popover.Title>Column visibility</Popover.Title>
                  <Popover.Close
                    aria-label="Close"
                    render={(props) => (
                      <button {...props} className="pds-popover-close">
                        <svg
                          width="10"
                          height="10"
                          viewBox="0 0 10 10"
                          fill="none"
                          aria-hidden="true"
                        >
                          <path
                            d="M2 2l6 6M8 2L2 8"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                          />
                        </svg>
                      </button>
                    )}
                  />
                </Popover.Header>
                <Popover.Body>
                  <div className="docs-section-stack-tight">
                    {["Name", "Email", "Role", "Status", "Last seen"].map(
                      (col, i) => (
                        <label key={col} className="docs-inline-label">
                          <Checkbox size="sm" defaultChecked={i !== 2} />
                          <span>{col}</span>
                        </label>
                      ),
                    )}
                  </div>
                </Popover.Body>
                <Popover.Footer>
                  <Button size="sm" variant="ghost">
                    Reset
                  </Button>
                  <Button size="sm">Apply</Button>
                </Popover.Footer>
              </Popover.Content>
            </Popover.Root>
          </section>

          <section className="docs-section">
            <h2 className="docs-h2">DataTable</h2>
            <p className="docs-prose docs-text-sm">
              Composes <code className="docs-mono">Checkbox</code>,{" "}
              <code className="docs-mono">StatusPill</code> and{" "}
              <code className="docs-mono">Avatar</code> into a sortable,
              searchable, paginated table with row selection.
            </p>
            <DataTable
              columns={userColumns}
              data={userRows}
              actions={
                <Button size="sm" variant="secondary">
                  Invite member
                </Button>
              }
            />
          </section>

          <section className="docs-section">
            <h2 className="docs-h2">Command Palette</h2>
            <p className="docs-prose docs-text-sm">
              Dialog-based command menu with fuzzy search, keyboard navigation,
              and grouped results. Press <kbd className="docs-mono">⌘K</kbd> /{" "}
              <kbd className="docs-mono">Ctrl+K</kbd> anywhere on the page, or
              use the button below.
            </p>
            <Button
              variant="secondary"
              onClick={() => commandPalette.setOpen(true)}
            >
              Open command palette
            </Button>
            <CommandPalette
              open={commandPalette.open}
              onOpenChange={commandPalette.setOpen}
              groups={commandGroups}
            />
          </section>

          <section className="docs-section">
            <h2 className="docs-h2">Chat</h2>
            <p className="docs-prose docs-text-sm">
              A message thread with grouped bubbles, reactions, delivery status,
              a date divider, and an auto-growing compose bar. Built from{" "}
              <code className="docs-mono">ChatThread</code>,{" "}
              <code className="docs-mono">ChatDateDivider</code>,{" "}
              <code className="docs-mono">ChatMessage</code>, and{" "}
              <code className="docs-mono">ChatCompose</code>.
            </p>
            <ChatDemo />
          </section>

          <section className="docs-section">
            <h2 className="docs-h2">Brand mark · gradient blob</h2>
            <p className="docs-prose docs-text-sm">
              Bubble&apos;s signature pink → magenta → violet gradient, exposed
              as <code className="docs-mono">--gradient-accent</code> and
              shipped as{" "}
              <code className="docs-mono">
                @bubble-design-system/ui/assets/logo-blob.svg
              </code>
              .
            </p>
            <div className="docs-row">
              <div className="docs-blob-lg" aria-hidden="true" />
              <div className="docs-blob-md" aria-hidden="true" />
              <div className="docs-blob-sm" aria-hidden="true" />
              <code className="docs-mono">bubble</code>
            </div>
          </section>
        </main>
        <Toast.Toaster />
      </Tooltip.Provider>
    </Toast.Provider>
  );
}
